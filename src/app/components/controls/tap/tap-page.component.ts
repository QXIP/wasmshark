import { Component, Input } from '@angular/core';

@Component({
  selector: 'tap-page',
  templateUrl: './tap-page.component.html',
  styleUrls: ['./tap-page.component.scss']
})
export class TapPageComponent {
  public loading = false;
  public title: string = '';
  public jsonData: any = null;
  public type: string = '';

  @Input() set taplink(obj: any) {

    this.title = obj.name;
    this.type = obj?.type || obj?.tap;
    this.jsonData = obj?.jsonData;
    console.log('taplink ==> ', obj)
  }
  async initData(link: string) {
    const data: any = {}; // await this.webSharkDataService.getTapJson(link);
    const [tapData] = data?.taps || [];
    this.jsonData = tapData;
    const { name, proto, type } = tapData || {};
    this.title = (name || proto || '') + (type ? ` [${type}]` : '');
    this.type = type || '';
    this.loading = false;
  }
}
