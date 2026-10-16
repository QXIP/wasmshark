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

  private hasCaptureLoaded(): boolean {
    return !!(this.wiregasmService.getCapture() || this.webSharkDataService.getCapture());
  }

  private async loadTapFromBackend(tapId: string): Promise<boolean> {
    if (!tapId || !this.hasCaptureLoaded()) {
      return false;
    }
    const data = await this.webSharkDataService.getTapJson(tapId);
    const [tapData] = data?.taps || [];
    if (!tapData) {
      return false;
    }
    this.jsonData = tapData;
    this.type = tapData.type || tapId;
    this.title = this.title || tapData.name || tapData.proto || tapId;
    return true;
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

      const tapId = obj?.tap || this.type;
      if (this.type === 'rtp-streams') {
        const loaded = await this.loadTapFromBackend('rtp-streams');
        if (!loaded) {
          this.jsonData = obj?.jsonData || { streams: [] };
        }
        return;
      }

      if (!tapId) {
        return;
      }

      await this.loadTapFromBackend(tapId);
    } catch (err) {
      console.error('tap-page load failed', err);
    } finally {
      this.loading = false;
    }
  }
}
