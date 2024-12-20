import { NgModule, Component } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-wireshark-ui-menu',
  template: `
     <mat-toolbar color="primary">

      <button mat-button [matMenuTriggerFor]="main_menu">My menu</button>
    </mat-toolbar>


    <mat-menu #main_menu="matMenu">
      <ng-container *ngFor="let mainItem of objectKeys(my_menu)">
        <button mat-menu-item [matMenuTriggerFor]="sub_menu">{{ mainItem }}</button>
        <mat-menu #sub_menu="matMenu">
           <button *ngFor="let subItem of objectKeys(my_menu[mainItem])" mat-menu-item>{{ subItem }}</button>
        </mat-menu>
      </ng-container>
    </mat-menu>
  `,
  styles: [
    `
    mat-toolbar {
      display: flex;
      justify-content: flex-start;
    }
    button {
      text-transform: none;
    }
    `
  ]
})
export class WiresharkUiMenuComponent {

  // my_menu: any = {
  //   'main1': ['sub1', 'sub2'],
  //   'main2': ['sub1', 'sub2', 'sub3'],
  // };

  my_menu: any = {
    'File': {
      'New': null,
      'Open': null,
      'Open Recent': {
        'File1': null,
        'File2': null,
        'Clear Recent Files': null
      },
      'Merge': null,
      'Import from Hex Dump': null,
      'Close': null,
      'Save': null,
      'Save As': null,
      'File Set': {
        'List Files': null,
        'Next File': null,
        'Previous File': null
      },
      'Export': {
        'Objects': {
          'HTTP': null,
          'DICOM': null,
          'IMF': null,
          'SMB': null
        },
        'Packet Dissections': null,
        'Specified Packets': null,
        'PDML File': null,
        'PSML File': null,
        'CSV File': null,
        'Plain Text File': null,
        'JSON File': null
      },
      'Print': null,
      'Quit': null
    },
    'Edit': {
      'Find Packet': null,
      'Preferences': null,
      'Configuration Profiles': {
        'New Profile': null,
        'Copy Profile': null,
        'Delete Profile': null,
        'Rename Profile': null
      }
    },
    'View': {
      'Main Toolbar': null,
      'Filter Toolbar': null,
      'Status Bar': null,
      'Packet List': null,
      'Packet Details': null,
      'Packet Bytes': null,
      'Time Display Format': {
        'Date and Time of Day': null,
        'Seconds Since Beginning of Capture': null,
        'Seconds Since Previous Captured Packet': null,
        'Seconds Since Previous Displayed Packet': null
      },
      'Time Format': {
        'Seconds': null,
        'Hours, Minutes, Seconds': null
      },
      'Time Precision': {
        'Automatic': null,
        'Seconds': null,
        'Milliseconds': null,
        'Microseconds': null,
        'Nanoseconds': null
      },
      'Coloring Rules': null,
      'Zoom': {
        'Zoom In': null,
        'Zoom Out': null,
        'Reset Zoom': null
      },
      'Resize Columns': null
    },
    'Capture': {
      'Options': null,
      'Start': null,
      'Restart': null,
      'Stop': null,
      'Capture Filters': null,
      'Refresh Interfaces': null
    },
    'Analyze': {
      'Display Filters': {
        'Manage Display Filters': null,
        'Apply Filter': null,
        'Reset Filter': null
      },
      'Apply as Filter': {
        'Selected': null,
        'Not Selected': null,
        'And Selected': null,
        'Or Selected': null
      },
      'Prepare a Filter': {
        'Selected': null,
        'Not Selected': null
      },
      'Enabled Protocols': null,
      'Decode As': null,
      'Follow': {
        'TCP Stream': null,
        'UDP Stream': null,
        'HTTP Stream': null
      },
      'Statistics': {
        'Summary': null,
        'Protocol Hierarchy': null,
        'Conversations': null,
        'Endpoints': null,
        'Packet Lengths': null,
        'I/O Graph': null,
        'Service Response Time': null
      }
    },
    'Statistics': {
      'Summary': null,
      'Protocol Hierarchy': null,
      'Conversations': null,
      'Endpoints': null,
      'Packet Lengths': null,
      'I/O Graph': null,
      'Service Response Time': null,
      'Packet Counter': null,
      'Stream Graphs': {
        'TCP Stream Graph': null,
        'Flow Graph': null
      }
    },
    'Telephony': {
      'VoIP Calls': null,
      'SIP Flows': null,
      'RTP': {
        'Show All Streams': null,
        'Stream Analysis': null,
        'RTP Player': null
      },
      'RTCP': null,
      'MGCP': null,
      'H.323': null
    },
    'Tools': {
      'Plugins': null,
      'Lua Console': null
    },
    'Help': {
      'Contents': null,
      'Manual Pages': null,
      'Wireshark Online': null,
      'Wireshark Wiki': null,
      'Sample Captures': null,
      'Protocol Reference': null,
      'About Wireshark': null
    }
  };

  objectKeys = Object.keys;
  subMenus: { [key: string]: any } = {};

  onMenuClick(item: any): void {
    console.log('Menu item clicked:', item);
  }
}
