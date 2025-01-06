import { WiregasmService } from '@app/services/wiregasm.service';
import { Component, Input, OnInit } from '@angular/core';
import { IPv4AnalyzerService, IPv4Statistics } from '@app/services/analyze/IPv4-statistics.service';

@Component({
  selector: 'app-ipv4-statistics',
  templateUrl: './ipv4-statistics.component.html',
  styleUrls: ['./ipv4-statistics.component.scss'],
})
export class IPv4StatisticsComponent implements OnInit {
  ipv4Stats: IPv4Statistics | null = null;

  @Input() data: any;

  constructor(private ipv4AnalyzerService: IPv4AnalyzerService, private wiregasmService: WiregasmService) { }

  ngOnInit(): void {
    const _Frames = this.wiregasmService._Frames;
    const frames = this.wiregasmService.allFrameDataArrayForFilter
      .filter(item => {
        return !!item.find((i: string) => i.includes('ip.version == 4'))
      })
      .map(item => {

        const f = (str: string, isNumber = false) => {
          const row = item.find((i: string) => i.includes(str)) || '';
          let [_, outStr = ''] = row.split(' == ');
          try {
            outStr = JSON.parse(outStr)
          } catch (_) { }
          return isNumber ? +(outStr) : outStr;
        };
        return {
          frameNumber: f('frame.number', true),
          timestamp: f('frame.time'),
          sourceIP: f('ip.src'),
          destinationIP: f('ip.dst'),
          protocol: f('frame.protocols'),
          length: f('ip.len', true),
          info: ''
        };
      })
    console.log('IPv4StatisticsComponent::', { frames });
    this.ipv4AnalyzerService.setFrames(frames);
    this.ipv4AnalyzerService.analyze();
    this.ipv4Stats = this.ipv4AnalyzerService.getIPv4Statistics();
  }
}
