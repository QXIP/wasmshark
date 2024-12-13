import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { WebSharkDataService } from '@app/services/web-shark-data.service';
import { hash } from '@app/helper/functions';
import WaveSurfer from 'wavesurfer.js';
import TimelinePlugin from 'wavesurfer.js/dist/plugins/timeline';
import { TypeOfChart } from '@app/components/controls/flexible-chart/flexible-chart.component';
import { WiregasmService } from '@app/services/wiregasm.service';

declare const transcode: Function;
const DATA_TYPE = 'application/octet-stream';

@Component({
  selector: 'stream-detail',
  templateUrl: './stream-detail.component.html',
  styleUrls: ['./stream-detail.component.scss']
})
export class StreamDetailComponent implements OnInit {
  onClose() {
    console.log('StreamDetailComponent::onClose');
    this.close.emit({})
  }

  lastRange: any;
  _data: any;
  columns: any;
  streams: any[] = [];
  selectedStreams: any;
  selectedColumns: any;

  players: any[] = [];
  optionsAudioContainer = {
    // waveColor: '#D2EDD4',
    normalize: true,
    progressColor: 'green',
    responsive: true,
    minPxPerSec: 100,

  }
  @Input() rec: any;

  @Input() set data(val: any) {
    this._data = val;
    this.streams = val.streams || [];
    const [stream] = this.streams || [];
    this.columns = Object.keys(stream || []);
  }
  @Output() close: EventEmitter<any> = new EventEmitter();
  get data(): any {
    return this._data;
  }
  typeOfChartRadio: TypeOfChart = 'bar'
  isReady = false;
  progressMessage = ['Initialization'];
  chartData: any[] = [];
  rangeChartData: any[] = [];
  audioStreamsBlobURL: any[] = [];
  columnDictionary: any = {
    bw: 'IP BW (kbps)',
    d: 'Delta',
    f: 'Packet (Time)',
    j: 'Jitter',
    mark: 'Marker',
    o: 'o',
    s: 'Status',
    sk: 'Skew (ms)',
    sn: 'Sequence',
    t: 't',
  };

  chartFilter = Object.entries(this.columnDictionary).map(([key, val]: any) => ({
    title: val,
    index: key,
    color: '#' + hash(key, 3),
    value: true
  }))
  columnsDictionary: any = Object.values(this.columnDictionary);
  constructor(
    private webSharkDataService: WiregasmService,
    private cdr: ChangeDetectorRef
  ) { }
  get titleId() {
    try {

      const [tap] = this.rec.rowData.taps;
      // console.log(
      //   tap
      // )
      const [sip, sport, dip, dport, ssrc] = (tap.tap || '').split(/[_]+/g);
      return `${ssrc} - ${sip}:${sport} -> ${dip}:${dport}`
    } catch (err) {
      return 'SSRC: ' + this.rec.rowData.ssrc;
    }
  }
  get captureFile() {
    return this.webSharkDataService.getCapture();
  }
  async getFileArrayOfUint8Array(filename: string) {
    const href = encodeURIComponent('/' + filename);
    const url = `/webshark/json?method=download&capture=${href}&token=self`;
    const { body } = await fetch(url);
    const reader = body?.getReader();
    if (!reader) {
      console.error(new Error('Could not get file'));
      return new Blob([], { type: DATA_TYPE });
    }
    let isDone = false;
    const collectArrayData = [];

    while (!isDone) {
      const { value, done } = await reader.read();
      if (value) {
        collectArrayData.push(value);
      }
      isDone = done;
    }

    // console.log({ collectArrayData });
    return new Blob(collectArrayData, { type: DATA_TYPE });

  }
  // blobSaveAsFile(blobUrl: string, filename: string) {
  //   var link = document.createElement("a"); // Or maybe get it from the current document
  //   link.href = blobUrl;
  //   link.download = filename;
  //   link.innerHTML = "Click here to download the file";
  //   document.body.appendChild(link);
  // }
  /**
   * parse PCAP to rtp-strems binnary data
   *  FFMPEG
   */
  async ffmpegDecoder() {
    this.progressMessage.push(`Reading data from ${this.captureFile} file`);
    this.cdr.detectChanges();
    // const blobData: Blob = await this.getFileArrayOfUint8Array(this.captureFile);
    const blobData: Blob = await this.webSharkDataService.blobFile;
    console.log('>>> ', this.captureFile, { blobData });
    // const blobUrl = await transcode(blobData);
    // console.log(blobUrl)

    this.progressMessage.push('Separate PCAP to frames');
    this.cdr.detectChanges();

    const index = await this.webSharkDataService.getFrames(0);
    console.log({ index })
    let offset = 24;
    const arrOffset = index.map((i: any, k: number, arr: any[]) => {
      if (k > 0) {
        offset += +arr[k - 1].colData[5];
      }
      offset += 16;
      return [offset, ...i.colData, blobData.slice(offset, offset + +i.colData[5], DATA_TYPE)];
    })
    // console.log(arrOffset);
    this.progressMessage.push('Collect payload binary to streams')
    this.cdr.detectChanges();
    // rtp-streams

    const rtpStreams: any = [];
    const _collect: any = {};
    index.filter((item: any) => {
      const info: string = item.colData[6];
      return !!info.match(/SSRC=/g);
    }).forEach((item: any) => {
      const info: string = item.colData[6];
      const outData: any = {};
      info.split(/\,\s/g).forEach(i => {
        const [key, val]: any = i.split('=');
        if (key === 'SSRC') {
          _collect[val] = true;
        }
        outData[key] = val;
      })
      rtpStreams.push(outData);
    });
    // const { taps: [{ streams: rtpStreams }] } = await this.webSharkDataService.getTapJson('rtp-streams');
    const arrSSRC = Object.keys(_collect);
    console.log({ _collect, rtpStreams });

    this.streams = arrSSRC.map(i => {
      return { ssrc: i }
    });

    // return [];
    const arr = arrSSRC.map((streamData: string) => {
      return {
        ssrc: streamData,
        data: { SSRC: streamData } as any,
        blob: new Blob(arrOffset
          .filter((frame: any) => frame[7].toUpperCase().includes(`SSRC=${streamData.toUpperCase()}`))
          .map((i: any) => (i[8] as Blob).slice(54)), { type: DATA_TYPE })
      };
    })
    // debugger;
    // console.log({ arr })
    const codecDictionary: any = {
      'g711a': 'alaw',
      'g711u': 'mulaw',
      'g722': 'g722',
    };
    const out: any[] = [];
    for (let item of arr) {
      // console.log('<>>>>', item.data);

      const codec = codecDictionary[(item.data?.payload + '').toLowerCase()] || 'g722';
      // console.log('<>>>>', {codec});

      // const i = arr[0];
      this.progressMessage.push(`FFmpeg:: converting ${item.ssrc} stream to audio (mp3)`);
      this.cdr.detectChanges();
      const blobUrl = await transcode(item.blob, codec, `audio-${item.ssrc}.mp3`);
      // console.log(blobUrl)

      out.push({ ssrc: item.ssrc, blobUrl });
      // this.blobSaveAsFile(blobUrl, `audio-${item.ssrc}.mp3`);
    }
    console.log({ out })
    return out;
  }

  // async ffmpegDecoder() {
  //   this.progressMessage.push(`Reading data from ${this.captureFile} file`);
  //   this.cdr.detectChanges();
  //   const blobData: Blob = await this.getFileArrayOfUint8Array(this.captureFile);
  //   // console.log(this.captureFile, { blobData });
  //   // const blobUrl = await transcode(blobData);
  //   // console.log(blobUrl)

  //   this.progressMessage.push('Separate PCAP to frames');
  //   this.cdr.detectChanges();

  //   const index = await this.webSharkDataService.getFrames(0);
  //   let offset = 24;
  //   const arrOffset = index.map((i: any, k: number, arr: any[]) => {
  //     if (k > 0) {
  //       offset += +arr[k - 1].c[5];
  //     }
  //     offset += 16;
  //     return [offset, ...i.c, blobData.slice(offset, offset + +i.c[5], DATA_TYPE)];
  //   })
  //   // console.log(arrOffset);
  //   this.progressMessage.push('Collect payload binary to streams')
  //   this.cdr.detectChanges();
  //   // rtp-streams
  //   const { taps: [{ streams: rtpStreams }] } = await this.webSharkDataService.getTapJson('rtp-streams');
  //   // console.log(rtpStreams);

  //   const arr = rtpStreams.map((streamData: any) => {
  //     return {
  //       ssrc: streamData.ssrc,
  //       data: streamData,
  //       blob: new Blob(arrOffset
  //         .filter((frame: any) => frame[7].toUpperCase().includes(`SSRC=${streamData.ssrc.toUpperCase()}`))
  //         .map((i: any) => (i[8] as Blob).slice(54)), { type: DATA_TYPE })
  //     };
  //   })
  //   // console.log({ arr })
  //   const codecDictionary: any = {
  //     'g711a': 'alaw',
  //     'g711u': 'mulaw',
  //     'g722': 'g722',
  //   };
  //   const out: any[] = [];
  //   for (let item of arr) {
  //     // console.log('<>>>>', item.data);

  //     const codec = codecDictionary[(item.data.payload + '').toLowerCase()] || 'g722';
  //     // console.log('<>>>>', {codec});

  //     // const i = arr[0];
  //     this.progressMessage.push(`FFmpeg:: converting ${item.ssrc} stream to audio (mp3)`);
  //     this.cdr.detectChanges();
  //     const blobUrl = await transcode(item.blob, codec, `audio-${item.ssrc}.mp3`);
  //     // console.log(blobUrl)

  //     out.push({ ssrc: item.ssrc, blobUrl });
  //     // this.blobSaveAsFile(blobUrl, `audio-${item.ssrc}.mp3`);
  //   }

  //   return out;
  // }
  getPlayer(rec: any) {
    /**
     * rec: { id, mp3, player }
     */
    if (!rec.player) {
      try {
        // rec.mp3 = 'http://localhost:8003/assets/we__will_rock_you.mp3'
        const player = WaveSurfer.create({
          ...this.optionsAudioContainer,
          container: '#' + (rec.id || 'audio-player'),
          plugins: [TimelinePlugin.create({
            /** The duration of the timeline in seconds, defaults to wavesurfer's duration */
            // duration: 1,
            /** Interval between ticks in seconds */
            timeInterval: 0.1,
            /** Interval between numeric labels in seconds */
            primaryLabelInterval: 1,
            /** Interval between secondary numeric labels in seconds */
            // secondaryLabelInterval: 8,
          })]

        });
        if (rec.mp3) {
          player.load(rec.mp3);
          player.on('ready', () => {
            player.zoom(1);
            player.on('audioprocess', (event: any) => {
              this.cdr.detectChanges();
            });
            this.cdr.detectChanges();
          });
        } else {
          rec.noData = true;
          this.cdr.detectChanges();
        }
        rec.player = player;
      } catch (err) {
        console.log(err, rec);
      }
    }
    return rec;

  }
  async ngOnInit() {

    this.audioStreamsBlobURL = await this.ffmpegDecoder();
    this.progressMessage.push('done.');
    this.cdr.detectChanges();
    requestAnimationFrame(() => {

      this.isReady = true;
      this.setRecActive();
      this.cdr.detectChanges();
    })

  }

  setRecActive() {

    console.log('setRecActive()', this.rec);
    // this.players.forEach(p => p.isActive = p.id === id);
    let playerElement = this.rec;
    const [tap]: any = playerElement.rowData?.taps || [];
    this.selectedStreams = tap?.items || [];
    const [item] = this.selectedStreams;
    this.selectedColumns = ["bw", "d", "f", "j", "mark", "o", "s", "sk", "sn", "t"]; // Object.keys(item);
    this.chartData = this.getChartData();
    this.onRange([0, 0]);
    this.cdr.detectChanges();
  }
  playItemClick(event: any) {
    console.log({ event });
  }
  onZoomAudio(event: any, player: any) {
    // console.log(event.wheelDelta);
    if (!player._myZoom) {
      player._myZoom = 1;
    }
    player._myZoom += event.wheelDelta / 12
    player._myZoom = Math.max(1, player._myZoom);
    player.zoom(player._myZoom);
    this.cdr.detectChanges();

  }
  onRange([a, b]: any) {
    const start = Math.min(a, b);
    const end = Math.max(a, b);

    console.log({ start, end });
    this.lastRange = { start, end };
    this.rangeChartData = [];

    this.chartData.forEach(item => {
      const out = Object.assign({}, item);
      if (start >= 0 && end >= 0 && start != end) {
        out.data = out.data.slice(start, end);
      } else {
        out.data = out.data;
      }
      this.rangeChartData.push(out)

    })
  }
  getChartData() {
    /**
     * format have to be like this:
     * [
          { data: [1, 3, 2, 4, 5, 4, 3, 2] },
          { data: [2, 4, 5, 4, 3, 2], typeOfChart: 'area', color: 'red' },
          . . .
          { data: [5, 4, 3, 2, 1, 4] }
        ]
     */
    // this.columnDictionary
    const outData: any[] = [];
    this.selectedColumns.forEach((column: string) => {
      if (this.chartFilter.find(i => i.index == column)?.value) {

        const d = {
          color: '#' + hash(column, 3),
          name: this.columnDictionary[column],
          data: this.selectedStreams.map((stream: any) => stream[column])
        };
        outData.push(d)
      }
    })
    console.log({ selectedStreams: this.selectedStreams });
    return outData;

  }
  onFilterChart() {
    console.log({ f: 'onFilterChart', d: this.chartFilter })
    this.chartData = this.getChartData();
    if (this.lastRange) {
      const { start, end } = this.lastRange;
      this.onRange([start, end]);
    } else {
      this.onRange([]);
    }
    this.cdr.detectChanges();
  }

}
