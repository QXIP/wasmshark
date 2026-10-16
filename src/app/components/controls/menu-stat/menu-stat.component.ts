import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { WebSharkDataService } from '@app/services/web-shark-data.service';
import { ModalResizableService } from '../modal-resizable/modal-resizable.service';
import { WiregasmService } from '@app/services/wiregasm.service';
import { Router } from '@angular/router';
import menu_data from '../../../helper/menu_data.json';
@Component({
  selector: 'app-menu-stat',
  templateUrl: './menu-stat.component.html',
  styleUrls: ['./menu-stat.component.scss']
})
export class MenuStatComponent implements OnInit {
  menuTreeIndex: any;
  menuTree: any;
  constructor(
    private webSharkDataService: WiregasmService,
    private modalResizableService: ModalResizableService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) { }
  menu_data:any = menu_data;
  async ngOnInit() {
    const d = await this.initMenu();
  }
  public onMenuClick(item: any) {
    this.modalResizableService.open({
      link: {
        name: item?.name,
        tap: item?.tap,
        type: item?.tap,
      }
    });
    this.cdr.detectChanges();
  }

  async initMenu() {
    try {
      this.menuTreeIndex = [];
      const info = await this.webSharkDataService.getInfo();
      const fallback = this.menu_data;
      const pick = (live: any[] | undefined, key: keyof typeof fallback) =>
        live?.length ? live : (fallback[key] as any[]) || [];

      const convs = pick(info?.convs, 'convs');
      const stats = pick(info?.stats, 'stats');
      const nstat = pick(info?.nstat, 'nstat');
      const taps = pick(info?.taps, 'taps');
      const eo = pick(info?.eo, 'eo');
      const srt = pick(info?.srt, 'srt');
      const rtd = pick(info?.rtd, 'rtd');
      const seqa = pick(info?.seqa, 'seqa');

      const menuCollection = [
        { name: 'Endpoints', children: [...convs] },
        { name: 'Response Time', children: [...srt, ...rtd] },
        { name: 'Statistics', children: [...stats, ...nstat, ...taps] },
        { name: 'Export Objects', children: [...eo] },
        { name: 'Misc', children: [...seqa] }
      ];
      this.menuTree = menuCollection;

      // console.log('menu', { menuCollection, menuTree: this.menuTree });
      this.cdr.detectChanges();
    } catch (err) {
      this.menuTree = [];
      console.error(err);
    }
  }
  gotoUploadPage() {
    location.reload();
  }
}
