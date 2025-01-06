import { Injectable } from '@angular/core';
import { hash } from '@app/helper/functions';
import { BehaviorSubject, Observable } from 'rxjs';


class StaticData {
  static captureFile: string = '';
  static filter: string = '';
}

@Injectable({
  providedIn: 'root'
})
export class WiregasmService {
  bs: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  worker: any;


  _Frames: any;
  _frame1: any;

  isParsingProcess = false;

  private behavior = new BehaviorSubject({})
  public updates: BehaviorSubject<any> = new BehaviorSubject({});

  public blobFile: Blob = new Blob([]);

  constructor() {
    if (typeof Worker !== 'undefined') {
      this.worker = new Worker(new URL('./../wiregasm.worker', import.meta.url));
      this.worker.onmessage = async ({ data }: { data: any }) => {
        if (typeof data === 'object' && data?.type === 'processed') {
          this._Frames = data.data.table;
          this._frame1 = data.data.frame1;

          const allFrames = await this.getAllFrameData();
          console.log('done parse all this._Frames===>', this._Frames);
          console.log('done parse all frames===>', allFrames);
          console.log('this.allFrameDataArray', this.allFrameDataArray);
          console.log('this.allFrameDataArrayForFilter', this.allFrameDataArrayForFilter);

          this.updates.next(data);
        }
        this.bs.next(data);
      };
    }
  }
  listen(): Observable<any> {
    return this.bs.asObservable();
  }
  async send(data: string) {
    this.worker.postMessage(data);
  }


  public getFrameNumberByFilter(filterText: string = '') {
    if (filterText === '') {
      return [];
    }
    const outArray: any[] = [];
    this.allFrameDataArrayForFilter.forEach((i, k) => {
      if (i.includes(filterText)) {
        outArray.push(k);
      }
    });
    console.log('getFrameNumberByFilter::', filterText, outArray);

    return outArray;
  }
  public setFilter(filter: string) {
    console.warn('setFilter', filter)
    // 'filter='+encodeURIComponent(`sip.Via.received == "195.138.93.233"`)
    StaticData.filter = filter;
    this.behavior.next({});
  }
  public getFilter(): string {
    console.warn('getFilter', StaticData.filter)
    return StaticData.filter;
  }
  public setCaptureFile(fileName: string) {
    console.warn('setCaptureFile', fileName)
    StaticData.captureFile = fileName;
    location.hash = '#' + hash(fileName);
    this.behavior.next({});
  }

  public getCapture(): string {
    console.warn('getCapture', StaticData.captureFile)
    return StaticData.captureFile;
  }

  private httpGet(command: string, params: any = null): Promise<any> {
    console.warn('httpGet', command, params)
    return new Promise((reason, reject) => {
      reason({})
    })

    // if (typeof params === 'string') {
    //   return this.getBufferGate<any>(`${this.url}?method=${command}&${params}`).toPromise();
    // }
    // if (!this.getCapture()) {
    //   return new Promise((reason, reject) => {
    //     reject({ error: 'Capture file is unset!' });
    //   })
    // }
    // const strParams = params ? this.params(command, params) : 'method=' + command;
    // return this.getBufferGate<any>(`${this.url}?${strParams}`).toPromise();
  }

  getInfo(): Promise<any> {
    return this.httpGet('info');
  }

  getFiles(dir: string = ''): Promise<any> {
    console.warn('getFiles', dir)
    return new Promise((reason, reject) => {
      reason({
        files: [], //[{ name: 'test.pcap', bytes: 1 }]
      })
    })

    // return this.httpGet('files', dir && 'dir=' + encodeURIComponent('/' + dir));
  }

  getFrames(limit = 120): Promise<any> {
    console.warn('getFrames', limit)

    return new Promise((reason, reject) => {
      if (this._Frames) {
        reason(this._Frames);
      } else {
        reject({ msg: 'no data' });
      }
    })

    // if (limit === 0) {
    //   return this.httpGet('frames', {});
    // }
    // return this.httpGet('frames', { limit });
  }
  getFlowItems() {
    const out: any[] = [];
    this.allFrameDataArrayForFilter.forEach((item: any, k: number) => {
      const outItem = item.filter((j: any) => j.includes('ip.src') || j.includes('ip.dst'));
      const nn = outItem.map((i: any) => i.split(' == ')[1]);
      const n = nn.map((i: any) => this._hostsBuffer.findIndex(j => j == i))
      let t = item.filter((j: any) => j.includes('frame.time == ')).join('').split(' == ')[1];
      t = new Date(t).toLocaleTimeString() + '.' + new Date(t).getMilliseconds();
      out.push({
        c: this._Frames[k].colData[6],
        t,
        n,
        pn: ['#000']
      });
      // console.log(n, outItem)
    })
    return out;
  }
  private _hostsBuffer: any[] = [];

  getHosts() { // array of IPs
    if (this._hostsBuffer.length == 0) {
      this._hostsBuffer = [].concat([], ...this.allFrameDataArrayForFilter.map((i: any) => {
        const out = i.filter((j: any) => j.includes('ip.src') || j.includes('ip.dst'));
        return out.map((i: any) => i.split(' == ')[1]);
      })).sort().filter((i, k, a) => a[k - 1] != i)
    }
    return this._hostsBuffer;
  }

  parseFrame(arrData: any[], isForFilter = true) {
    const out: any = {};

    const outFilter: any = [];

    const parseTree = (arr: any) => {
      arr.forEach((i: any) => {
        const [key, val] = (i.filter).split(' == ');
        out[key] = val;
        outFilter.push(i.filter);
        if (i.tree) {
          parseTree(i.tree || [])
        }
      })
    }
    parseTree(arrData);
    return isForFilter ? outFilter : out;
  }
  allFrameDataArray: any[] = [];
  allFrameDataArrayForFilter: any[] = [];
  allFrameDataArrayForFilterAsObject: any[] = [];

  async getAllFrameData(n = 1): Promise<any> {
    const out = (await this.getFrameData(n));
    // console.log({out})
    this.allFrameDataArray.push(out);
    this.allFrameDataArrayForFilter.push(this.parseFrame(out?.tree || []))
    // console.log('frames => ', this._Frames);
    this.bs.next({
      isParsing: true,
      parsingProgress: n / +this._Frames.length * 100
    });
    if (n < +this._Frames.length) {
      return await this.getAllFrameData(n + 1);
    } else {
      return this.allFrameDataArray;
    }
  }
  getFrameData(frameId: number): Promise<any> {
    // console.warn('getFrameData', frameId)
    // this._frame1

    return new Promise((reason, reject) => {
      if (this.allFrameDataArray[frameId - 1]) {
        console.log('frame exist', frameId - 1, this.allFrameDataArray[frameId - 1])
        reason(this.allFrameDataArray[frameId - 1])

        return;
      }
      this.worker.onmessage = (data: any) => {
        // console.log('getFrameData', { data: data.data.data.frame1 })
        reason(data.data.data.frame1);
      }
      this.worker.postMessage({ type: "getFrame", frameId })
    })


  }
  getTapJson(tapID: string): Promise<any> {
    console.warn('getTapJson', tapID)
    return this.httpGet('tap', { tap0: tapID })
  }
  getRTPStreamTap(rtpData: any): Promise<any> {
    console.warn('getRTPStreamTap', rtpData)
    const { saddr, sport, daddr, dport, ssrc } = rtpData;
    const tap0 = 'rtp-analyse:' + [
      saddr, sport, daddr, dport,
      ssrc.toString(16)
    ].join('_');

    return this.httpGet('tap', { tap0 });
    /**
     * data = {
        "ssrc":1289913356,
        "payload":"g711A",
        "saddr":"10.0.131.72",
        "sport":5010,
        "daddr":"10.0.131.70",
        "dport":5014,
        "pkts":555,
        "max_delta":23.220000,
        "max_jitter":2.800501,
        "mean_jitter":2.687978,
        "expectednr":555,
        "totalnr":555,
        "problem":false,
        "ipver":4
      }
     */
  }
  postFile(fileToUpload: File, isDataTimeNow: any): Observable<any> {
    console.warn('postFile', fileToUpload)

    const reader = new FileReader();
    reader.onload = (e: any) => {
      const arrayBuffer: any = e.target.result;
      const blob = new Blob([arrayBuffer], { type: fileToUpload.type });
      this.blobFile = blob;
    };
    reader.readAsArrayBuffer(fileToUpload);

    return new Observable((observe) => {
      // worker.postMessage({ type: "process", file: file });
      this.worker.postMessage({ type: "process", file: fileToUpload });
      observe.next({});
      observe.complete();
    });
  }
}
