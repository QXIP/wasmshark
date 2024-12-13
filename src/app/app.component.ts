import { Component, Inject } from '@angular/core';
import { WiregasmService } from './services/wiregasm.service';
@Component({
  selector: 'app-root',
  template: `
  <div class="progress-upload" *ngIf=" parsingProgress != 100"

  >
    <h1 style="font-size: 24pt;">
      Parsing file: {{ parsingProgress.toFixed(2) }}%
    </h1>
    <div class="progress-bar" [style.width.%]="parsingProgress"></div>
  </div>
  <div class="init-status-wrapper" [ngClass]="{ready: isReady}" [hidden]="done">
    <div class="init-status">
      <h1><strong>Wiregasm:</strong></h1>
      <div *ngFor="let item of msg">{{item}}</div>
    </div>
  </div>
  <router-outlet></router-outlet>`,
  styleUrls: ['./app.component.scss'],

})
export class AppComponent {
  msg: string[] = [];
  done = false;
  isReady = false;
  parsingProgress = 100;
  constructor(private wiregasmService: WiregasmService) {
    this.wiregasmService.listen().subscribe(data => {
      console.log('wiregasmService.listen', data);
      if (data?.isParsing) {
        this.parsingProgress = +data?.parsingProgress?.toFixed(2);
      }
      if (data?.status) {
        this.msg.push(data.status)
      }
      if (data?.type === 'init') {
        this.isReady = true;
        setTimeout(() => {

          this.done = true;
        }, 1000)
      }
    })
  }

}
