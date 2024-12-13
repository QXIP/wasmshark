import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TapPageComponent } from './tap-page.component';
import { TreeFilterModule } from '../tree-filter/tree-filter.module';
import { TapFlowModule } from './tap-flow/tap-flow.module';
import { TapRtpStreamsModule } from './tap-rtp-streams/tap-rtp-streams.module';
import { NoDataModule } from '../no-data/no-data.module';
import { ChartAndTableModule } from '../chart-and-table/chart-and-table.module';

@NgModule({
  imports: [
    CommonModule,
    TreeFilterModule,
    TapFlowModule,
    TapRtpStreamsModule,
    NoDataModule,
    ChartAndTableModule
  ],
  declarations: [TapPageComponent],
  exports: [TapPageComponent]
})
export class TapPageModule { }
