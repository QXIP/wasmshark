import { WiregasmService } from '@app/services/wiregasm.service';
import { Component, Input, OnInit } from '@angular/core';
import { IPv6AnalyzerService, IPv6Statistics } from '@app/services/analyze/IPv6-statistics.service';

@Component({
  selector: 'app-ipv6-statistics',
  templateUrl: './ipv6-statistics.component.html',
  styleUrls: ['./ipv6-statistics.component.scss'],
})
export class IPv6StatisticsComponent implements OnInit {
  ipv6Stats: IPv6Statistics | null = null;

  @Input() data: any;

  constructor(private ipv6AnalyzerService: IPv6AnalyzerService, private wiregasmService: WiregasmService) { }

  ngOnInit(): void {
    const _Frames = this.wiregasmService._Frames;
    const frames = this.wiregasmService.allFrameDataArrayForFilter
      .filter(item => {
        return !!item.find((i: string) => i.includes('ip.version == 6'))
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
    console.log('IPv6StatisticsComponent::', { frames });
    this.ipv6AnalyzerService.setFrames(frames);
    this.ipv6AnalyzerService.analyze();
    this.ipv6Stats = this.ipv6AnalyzerService.getIPv6Statistics();
  }
}
