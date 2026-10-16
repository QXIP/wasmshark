import { Component, Input } from '@angular/core';
import { WebSharkDataService } from '@app/services/web-shark-data.service';
import { WiregasmService } from '@app/services/wiregasm.service';

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

  constructor(
    private webSharkDataService: WebSharkDataService,
    private wiregasmService: WiregasmService,
  ) { }

  @Input() set taplink(obj: any) {
    this.title = obj?.name || '';
    this.type = obj?.type || obj?.tap || '';
    void this.loadTapData(obj);
  }

  private async loadTapData(obj: any) {
    this.loading = true;
    this.jsonData = null;
    try {
      if (this.type === 'flow') {
        const nodes = this.wiregasmService.getHosts();
        const flows = this.wiregasmService.getFlowItems();
        this.jsonData = { nodes, flows };
        return;
      }

      if (this.type === 'rtp-streams') {
        this.jsonData = obj?.jsonData || { streams: [] };
        return;
      }

      const tapId = obj?.tap || this.type;
      if (!tapId) {
        return;
      }

      if (this.wiregasmService.getCapture()) {
        const data = await this.webSharkDataService.getTapJson(tapId);
        const [tapData] = data?.taps || [];
        if (tapData) {
          this.jsonData = tapData;
          this.type = tapData.type || tapId;
          this.title = this.title || tapData.name || tapData.proto || tapId;
        }
      }
    } catch (err) {
      console.error('tap-page load failed', err);
    } finally {
      this.loading = false;
    }
  }
}
