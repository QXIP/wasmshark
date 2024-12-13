import { ModalResizableService } from './../controls/modal-resizable/modal-resizable.service';
import { WebSharkDataService } from '@app/services/web-shark-data.service';
import { Component, OnInit } from '@angular/core';
import { environment } from '@environments/environment';
import { WiregasmService } from '@app/services/wiregasm.service';


declare const transcode: Function;
@Component({
  selector: 'app-Home',
  templateUrl: './Home.component.html',
  styleUrls: ['./Home.component.scss']
})
export class HomeComponent implements OnInit {
  typeOfChart: any = 'area';
  files: any;
  isKIOSK = !!environment.kiosk;
  isFileOnLink: boolean = false;
  dialogs: any[] = [];
  framePosition: any = ['vertical', 'horizontal'];
  constructor(
    private webSharkDataService: WiregasmService,
    private modalResizableService: ModalResizableService
  ) {
    this.isFileOnLink = !location.hash;
    this.files = this.isFileOnLink;
    this.modalResizableService.event.subscribe(({ open, data }) => {
      if (open) {
        this.dialogs.push(data.link)
      }
    });

  }
  async ngOnInit() {
    await this.getFiles();
  }
  async getFiles() {

    const getFiles: Function = (dir: string) => this.webSharkDataService.getFiles(dir);
    const fileData = await getFiles();
    const mapping = (file: any, prefix: string = '/') => {
      if (file.dir === true) {
        const o: any = {
          name: file.name + ` <i></i>[..loading]</i>`,
          description: prefix,
          children: []
        }
        getFiles(file.name).then((data: any) => {
          const arrFiles: any = data.files.map((i: any) => mapping(i, file.name));
          o.name = file.name;
          o.description = prefix;
          o.children.push(...arrFiles);
          this.files = [...this.files];

        })
        return o;
      }
      file.description = prefix;
      return file;
    }
    const files = fileData.files.map((i: any) => mapping(i, ''));
    this.files = [
      ...files.filter((i: any) => i.children),
      ...files.filter((i: any) => !i.children)
    ];
    // console.log('FILES', this.files);
  }
  onClose(idx: number): void {
    this.dialogs = this.dialogs.filter((i, k) => k !== idx);
  }
  get captureFile() {
    return 'file.pcap' //this.webSharkDataService.getCapture();
  }

  downloadFile(filename: string) {
    if (!filename) {
      return;
    }
    // console.log('downloading file', filename);
    const href = encodeURIComponent('/' + filename);
    const url = `/webshark/json?method=download&capture=${href}&token=self`;

    const link = document.createElement('a');
    link.setAttribute('target', '_blank');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    // link.remove();
  }

  saveToFile(data: any, filename: string, type = 'application/octet-stream') {
    const file = new Blob([data], { type: type });
    const nav: any = window.navigator as any;
    if (nav.msSaveOrOpenBlob) {
      // IE10+
      nav.msSaveOrOpenBlob(file, filename);
    } else {
      // Others
      const a = document.createElement('a'),
        url = URL.createObjectURL(file);
      a.href = url;
      a.target = '(file)';
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      setTimeout(function () {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }, 0);
    }
  }

}
