import { Component, Input, OnInit } from '@angular/core';
import { IPv4AnalyzerService, IPv4Statistics } from '@app/services/analyze/IPv4-statistics.service';

@Component({
  selector: 'app-ipv4-statistics',
  templateUrl: './ipv4-statistics.component.html',
  styleUrls: ['./ipv4-statistics.component.css'],
})
export class IPv4StatisticsComponent implements OnInit {
  ipv4Stats: IPv4Statistics | null = null;

  @Input() data:any;

  constructor(private ipv4AnalyzerService: IPv4AnalyzerService) {}

  ngOnInit(): void {
    const frames: any[] = [
      { frameNumber: 1, timestamp: '2024-12-23T12:00:00Z', sourceIP: '192.168.0.1', destinationIP: '192.168.0.2', protocol: 'TCP', length: 100, info: 'Info 1' },
      { frameNumber: 2, timestamp: '2024-12-23T12:00:01Z', sourceIP: '192.168.0.1', destinationIP: '192.168.0.3', protocol: 'UDP', length: 200, info: 'Info 2' },
      { frameNumber: 3, timestamp: '2024-12-23T12:00:02Z', sourceIP: '192.168.0.2', destinationIP: '192.168.0.1', protocol: 'TCP', length: 150, info: 'Info 3' },
    ];

    this.ipv4AnalyzerService.setFrames(frames);
    this.ipv4AnalyzerService.analyze();
    this.ipv4Stats = this.ipv4AnalyzerService.getIPv4Statistics();
  }
}
