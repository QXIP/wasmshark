import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TapPageComponent } from './tap-page.component';
import { TreeFilterModule } from '../tree-filter/tree-filter.module';
import { TapFlowModule } from './tap-flow/tap-flow.module';
import { TapRtpStreamsModule } from './tap-rtp-streams/tap-rtp-streams.module';
import { NoDataModule } from '../no-data/no-data.module';
import { ChartAndTableModule } from '../chart-and-table/chart-and-table.module';
import { IPv4StatisticsComponent } from './statistics/ipv4-statistics/ipv4-statistics.component';
import { IPv6StatisticsComponent } from './statistics/ipv6-statistics/ipv6-statistics.component';
import { DHCPStatisticsComponent } from './statistics/DHCP-statistics/DHCP-statistics.component';
import { CustomTableModule } from '../custom-table/custom-table.module';
import { NetPerfMeterStatisticsComponent } from './statistics/NetPerfMeter-Statistics/NetPerfMeter-Statistics.component';

@NgModule({
  imports: [
    CommonModule,
    TreeFilterModule,
    TapFlowModule,
    TapRtpStreamsModule,
    NoDataModule,
    ChartAndTableModule,
    CustomTableModule
  ],
  declarations: [
    TapPageComponent,
    IPv4StatisticsComponent,
    IPv6StatisticsComponent,
    DHCPStatisticsComponent,
    NetPerfMeterStatisticsComponent
  ],
  exports: [TapPageComponent]
})
export class TapPageModule { }
