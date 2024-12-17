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
  public onMenuClick(link: any) {
    this.modalResizableService.open({ link });
    this.cdr.detectChanges();
  }

  async initMenu() {
    try {
      this.menuTreeIndex = [];
      console.log('MENU:ngOnInit()', this.menu_data)
      const info = await this.webSharkDataService.getInfo();
      const {
        stats = [], nstat = [], convs = [],
        seqa = [], taps = [], eo = [],
        srt = [], rtd = []
      } = this.menu_data;

      const menuCollection = [
        // Endpoints
        { name: 'Endpoints', children: [...convs] },
        { name: 'Response Time', children: [...srt, ...rtd] },
        { name: 'Statistics', children: [...stats, ...nstat] },
        { name: 'Export Objects', children: [...eo] },
        { name: 'Misc', children: [...taps, ...seqa] }
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
