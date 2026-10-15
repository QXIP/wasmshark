import { ModalResizableService } from './../controls/modal-resizable/modal-resizable.service';
import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { WiregasmService } from '@app/services/wiregasm.service';
import menu_data from '@app/helper/menu_data.json';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MenuComponent implements OnInit {
  menuTree: any = null;
  menuTreeIndex: any = [];
  constructor(
    private webSharkDataService: WiregasmService,
    private modalResizableService: ModalResizableService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.initMenu();
    this.webSharkDataService.updates.subscribe(() => this.initMenu());
  }

  public onMenuClick(link: string, name: string) {
    this.modalResizableService.open({
      link: {
        name,
        tap: link,
        type: link,
      }
    });
    this.cdr.detectChanges();
  }

  async initMenu() {
    try {
      this.menuTreeIndex = [];
      // console.log('MENU:ngOnInit()')
      const info = await this.webSharkDataService.getInfo();
      const fallback = menu_data as any;
      const stats = info?.stats?.length ? info.stats : (fallback.stats || []);
      const nstat = info?.nstat?.length ? info.nstat : (fallback.nstat || []);
      const convs = info?.convs?.length ? info.convs : (fallback.convs || []);
      const seqa = info?.seqa?.length ? info.seqa : (fallback.seqa || []);
      const taps = info?.taps?.length ? info.taps : (fallback.taps || []);
      const eo = info?.eo?.length ? info.eo : (fallback.eo || []);
      const srt = info?.srt?.length ? info.srt : (fallback.srt || []);
      const rtd = info?.rtd?.length ? info.rtd : (fallback.rtd || []);

      const menuCollection = [
        { name: 'Endpoints', children: [...convs] },
        { name: 'Response Time', children: [...srt, ...rtd] },
        { name: 'Statistics', children: [...stats, ...nstat, ...taps] },
        { name: 'Export Objects', children: [...eo] },
        { name: 'Analyze', children: [...seqa] }
      ].filter((section) => section.children.length > 0);

      this.menuTree = menuCollection.map(menu => {
        // console.log(menu.children);
        menu.children = menu.children.reduce((a: any, i: any) => {
          if (i.tap.split(':')[0] === 'eo') {
            a[i.name] = i.tap;
            return a;
          }

          const [category, ...name] = i.name.split('/');
          if (name.join('/')) {
            if (!a[category]) {
              a[category] = [];
            }

            a[category].push({
              name: i.name,
              func: () => this.onMenuClick(i.tap, i.name)
            })
            this.menuTreeIndex.push({
              name: i.name,
              func: () => this.onMenuClick(i.tap, i.name)
            })
            // this.webSharkDataService.getTapJson(i.tap).then( d => {
            //   console.log({d});
            // });
          } else {
            a[category] = i.tap;
          }
          return a;
        }, {})
        menu.children = Object.entries(menu.children).map(([key, value]: any[]) => {
          if (typeof value === 'string') {
            // this.webSharkDataService.getTapJson(value).then( d => {
            //   console.log({d});
            // });
            this.menuTreeIndex.push({
              name: key,
              func: () => this.onMenuClick(value, key)
            });
            return {
              name: key,
              func: () => this.onMenuClick(value, key)
            }
          }
          return {
            name: key,
            children: value
          }
        })
        return menu;
      });

      // console.log('menu', { menuCollection, menuTree: this.menuTree });
      this.cdr.detectChanges();
    } catch (err) {
      this.menuTree = [];
      console.error(err);
    }
  }
  onSelected(event: any) {
    const menuItem = this.menuTreeIndex.find((i: any) => i.name === event.name);
    menuItem?.func();
    // console.log(event, this.menuTreeIndex.find((i: any) => i.name === event.name))
  }
}
