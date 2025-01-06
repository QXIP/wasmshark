import { WebSharkDataService } from '@app/services/web-shark-data.service';
import { Functions } from '@app/helper/functions';
import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  AfterViewInit,
  Output,
  EventEmitter,
  Input,
  ViewChild,
  OnInit
} from '@angular/core';
import { HighlightService } from '@app/services/hightlight.service';
import { AlertService } from '../alert/alert.service';
import { CustomTableComponent } from '../custom-table/custom-table.component';
import { environment } from './../../../../environments/environment';
import { WiregasmService } from '@app/services/wiregasm.service';

@Component({
  selector: 'app-webshark',
  templateUrl: './webshark.component.html',
  styleUrls: ['./webshark.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush

})
export class WebsharkComponent implements OnInit, AfterViewInit {
  textFilterGrid: string = '';
  _data: any;
  dataTree: any[] = [];
  destDetailsTable = [];
  detailsTable = [];
  columnsTable = ['id', 'time', 'source', 'description', 'protocol', 'length', 'info'];
  dataIndex: any[] = [];
  frameHexDataBase64: string = '';
  highlight: any;
  sizeUp: boolean = false;
  selectedHexArray: any[] = [];
  isKIOSK = !!environment.kiosk;
  @Input() fileList: any = [];
  @Input() framePosition: any = ['horizontal', 'vertical'];
  @Input() set range(val: any) {
    if (val) {
      const [from, to] = (val || []).sort((a: number, b: number) => a < b ? -1 : a > b ? 1 : 0);

      if (from === to) {
        this.detailsTable = this.destDetailsTable;
        this.cdr.detectChanges();
        return;
      }
      if ((from === 0 || from) && to) {
        this.detailsTable = this.destDetailsTable.slice(from, to);
        this.cdr.detectChanges();
      }
    }

  }
  @Output() ready: EventEmitter<any> = new EventEmitter();
  @Output() dblclick: EventEmitter<any> = new EventEmitter();

  @ViewChild('dataGridTable', { static: false }) dataGrid: any;

  constructor(
    private webSharkDataService: WiregasmService,
    private highlightService: HighlightService,
    private cdr: ChangeDetectorRef,
    private alertService: AlertService

  ) { }

  ngAfterViewInit() {
    setTimeout(() => {
      // this.ready.emit({});
      this.cdr.detectChanges();
    }, 100);
  }
  ngOnInit() {
    this.textFilterGrid = this.webSharkDataService.getFilter();
    this.webSharkDataService.updates.subscribe(() => this.initData());
  }

  onClickFile(filename: string) {
    this.webSharkDataService.setCaptureFile(filename);
  }

  private async initData() {
    // try {
    const data = await this.webSharkDataService.getFrames(0);
    console.log('initData()', { data })
    this.destDetailsTable = data.map((frame: any) => {
      const [id, time, source, description, protocol, length, info] = frame.colData;
      const { bg, fg } = frame;
      return { id, time, source, description, protocol, length, info, bg, fg };
    });
    this.detailsTable = this.destDetailsTable;
    this.ready.emit([{
      color: 'rgba(255,255,255, 0.8)',
      data: this.destDetailsTable.map((i: any) => i.length * 1)
    }]);
    this.cdr.detectChanges();
    this.setDefaultSelection();
    // } catch (error) {
    //   console.log({error})
    //   return;
    // }

    this.initFrameData(1);
    this.cdr.detectChanges();
  }
  setDefaultSelection() {
    const dataGrid: CustomTableComponent = this.dataGrid as CustomTableComponent;
    if (dataGrid) {
      dataGrid.setSelected(0);
    } else {
      setTimeout(() => { this.setDefaultSelection() }, 500);
    }

  }
  private async initFrameData(frameId: number) {
    const frameData: any = await this.webSharkDataService.getFrameData(frameId);
    console.log({ frameData })
    // this.frameHexDataBase64 = frameData.bytes;
    try {

      this.frameHexDataBase64 = frameData.data_sources[0].data;
      this.dataIndex = [];
      const convert: Function = ({ label: name, filter: description, tree: n, length, start }: any) => {
        const highlight = [start, length]
        const out = {
          name, description, highlight,
          children: n?.map((item: any) => convert(item))
        }
        this.dataIndex.push(Functions.cloneObject(out));
        return out;
      };
      this.dataTree = frameData?.tree?.map((frame: any) => convert(frame)) || [];
      // console.log({ ws_this_dataIndex: this.dataIndex });
      this.ngAfterViewInit();
      this.cdr.detectChanges();
    } catch (e) { }
  }

  showMessage(event: any) {
    this.initFrameData(+event.row.id);
  }

  openDetails(event: any) {
    const data = event?.row?.item;
    data.uniqueId = Functions.md5object(data);
    this.dblclick.emit({ data });
  }
  filterGrid(details: any) {
    const indexesOfFrame = this.webSharkDataService.getFrameNumberByFilter(this.textFilterGrid);

    console.log('filterGrid', {details})
    if (indexesOfFrame.length > 0) {
      return indexesOfFrame.map(i => details[i]);
    } else {
      return details;
    }
  }
  onSelectedHex(x: any) {
    const arraySelected = this.getSelectedItems(x);
    this.selectedHexArray = arraySelected || [];
    const [selectedHex] = arraySelected.filter(i => !i.children).slice(-1) || [];
    if (selectedHex?.highlight) {
      this.highlight = selectedHex?.highlight;
      this.highlightService.set(this.highlight);
    }
    // console.log('onSelectedHex', { x, arraySelected });
    this.cdr.detectChanges();
  }

  getSelectedItems(x: number = 0) {
    return this.dataIndex.filter(i => {
      if (!i.highlight) {
        return false;
      }
      const [from, to] = i.highlight;
      return from <= x && (from + to) > x;
    });
  }
  setFilter(filter: any) {
    this.textFilterGrid = filter;
    // this.webSharkDataService.setFilter(this.textFilterGrid);
  }
  onFilterEnter() {
    this.setFilter(this.textFilterGrid);
  }
  onSelected(event: any) {
    this.highlight = event.highlight;
    // console.log('onSelected', { event });
    if (this.highlight) {
      const arraySelected = this.getSelectedItems(this.highlight[0]);
      this.selectedHexArray = arraySelected || [];
      this.highlightService.set(this.highlight);
      this.cdr.detectChanges();
    }
  }
}
