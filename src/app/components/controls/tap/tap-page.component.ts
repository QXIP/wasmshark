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
    this.type = obj?.type;
    this.jsonData = obj?.jsonData;
    console.log('taplink ==> ', obj)
  }

}
