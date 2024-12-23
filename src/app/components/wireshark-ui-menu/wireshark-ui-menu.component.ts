import { Component } from '@angular/core';
import { ModalResizableService } from '../controls/modal-resizable/modal-resizable.service';

@Component({
  selector: 'app-wireshark-ui-menu',
  templateUrl: 'wireshark-ui-menu.component.html',
  styleUrls: ['wireshark-ui-menu.component.scss']

})
export class WiresharkUiMenuComponent {

  constructor(private modalResizableService: ModalResizableService) { }

  onMenuClick(item: any = null, options: any = null): void {
    console.log('Menu item clicked:', item);
    this.modalResizableService.open({
      link: {
        name: item + '',
        type: options?.type || '',
        jsonData: options ? {}: null
      }
    });
  }

}
