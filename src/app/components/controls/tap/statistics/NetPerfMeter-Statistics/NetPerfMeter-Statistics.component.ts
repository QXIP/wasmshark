import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-NetPerfMeter-Statistics',
  templateUrl: './NetPerfMeter-Statistics.component.html',
  styleUrls: ['./NetPerfMeter-Statistics.component.css']
})
export class NetPerfMeterStatisticsComponent implements OnInit {
  columnDictionary = {
    n: 'NetPerfMeter Message Type',
    m: 'Messages',
    ms: 'Messages Share (%)',
    bytes: 'Bytes (B)',
    bytes_share: 'Bytes Share (%)',
    fs: 'First Seen (s)',
    ls: 'Last Seen (s)',
    interval: 'Interval (s)',
    mes_rate: 'Message Rate (Msg/s)',
    br: 'Byte Rate (B/s)',

  }
  selectedStreams: any[] = [
    { n: 'NetPerfMeter Acknowledge', m: 0, ms: '', bytes: 0, bytes_share: '', fs: '', ls: '', interval: '', mes_rate: '', br: '' },
    { n: 'NetPerfMeter Add Flow', m: 0, ms: '', bytes: 0, bytes_share: '', fs: '', ls: '', interval: '', mes_rate: '', br: '' },
    { n: 'NetPerfMeter Data', m: 0, ms: '', bytes: 0, bytes_share: '', fs: '', ls: '', interval: '', mes_rate: '', br: '' },
    { n: 'NetPerfMeter Identify Flow', m: 0, ms: '', bytes: 0, bytes_share: '', fs: '', ls: '', interval: '', mes_rate: '', br: '' },
    { n: 'NetPerfMeter Remove Flow', m: 0, ms: '', bytes: 0, bytes_share: '', fs: '', ls: '', interval: '', mes_rate: '', br: '' },
    { n: 'NetPerfMeter Results', m: 0, ms: '', bytes: 0, bytes_share: '', fs: '', ls: '', interval: '', mes_rate: '', br: '' },
    { n: 'NetPerfMeter Start Measurement', m: 0, ms: '', bytes: 0, bytes_share: '', fs: '', ls: '', interval: '', mes_rate: '', br: '' },
    { n: 'NetPerfMeter Stop Measurement', m: 0, ms: '', bytes: 0, bytes_share: '', fs: '', ls: '', interval: '', mes_rate: '', br: '' }
  ]
  constructor() { }

  ngOnInit() {
  }

}
