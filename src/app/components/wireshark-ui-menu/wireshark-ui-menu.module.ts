import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WiresharkUiMenuComponent } from './wireshark-ui-menu.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';

@NgModule({
  imports: [
    CommonModule,
    MatMenuModule,
    MatButtonModule,
    MatToolbarModule,
    MatIconModule
  ],
  declarations: [WiresharkUiMenuComponent],
  exports: [WiresharkUiMenuComponent]
})
export class WiresharkUiMenuModule { }
