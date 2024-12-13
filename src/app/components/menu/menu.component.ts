import { ModalResizableService } from './../controls/modal-resizable/modal-resizable.service';
import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { WebSharkDataService } from '@app/services/web-shark-data.service';
import { WiregasmService } from '@app/services/wiregasm.service';

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
    this.modalResizableService.open({ link, name });
    this.cdr.detectChanges();
  }

  async initMenu() {
    try {
      this.menuTreeIndex = [];
      // console.log('MENU:ngOnInit()')
      const {
        stats = [], nstat = [], convs = [],
        seqa = [], taps = [], eo = [],
        srt = [], rtd = [], columns = [],
        ftypes = [], version = [], follow = []
      } = await this.webSharkDataService.getInfo();

      const menuCollection = [
        // { name: 'Endpoints', children: [...convs] },
        // { name: 'Response Time', children: [...srt, ...rtd] },
        // { name: 'Statistics', children: [...stats, ...nstat] },
        // { name: 'Export Objects', children: [...eo] },
        { name: 'menu', children: [...taps, ...seqa] }
      ];

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
