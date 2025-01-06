import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-DHCP-statistics',
  templateUrl: './DHCP-statistics.component.html',
  styleUrls: ['./DHCP-statistics.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DHCPStatisticsComponent implements OnInit {
  columnDictionary = {
    n: 'DHCP Message Type',
    p: 'Packets'
  }
  selectedStreams: any[] = [
    {n: 'ACK', p: 0},
    {n: 'Active LeaseQuery', p: 0},
    {n: 'Bulk Lease Query', p: 0},
    {n: 'Decline', p: 0},
    {n: 'Discover', p: 0},
    {n: 'Force Renew', p: 0},
    {n: 'Inform', p: 0},
    {n: 'Lease Active', p: 0},
    {n: 'Lease Query Done', p: 0},
    {n: 'Lease Query Status', p: 0},
    {n: 'Lease Unassigned', p: 0},
    {n: 'Lease Unknown', p: 0},
    {n: 'Lease query', p: 0},
    {n: 'NAK', p: 0},
    {n: 'Offer', p: 0},
    {n: 'Release', p: 0},
    {n: 'Request', p: 0},
    {n: 'TLS', p: 0},
  ]
  constructor(private cdr:ChangeDetectorRef) { }

  ngOnInit() {
    requestAnimationFrame(() => {
      this.cdr.detectChanges();
    })
  }

}
