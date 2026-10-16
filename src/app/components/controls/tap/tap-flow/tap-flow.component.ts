import { Functions, hash } from '@app/helper/functions';
import { AfterContentInit, AfterViewInit, ChangeDetectorRef, Component, Input, OnDestroy, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { WiregasmService } from '@app/services/wiregasm.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'tap-flow',
  templateUrl: './tap-flow.component.html',
  styleUrls: ['./tap-flow.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TapFlowComponent implements OnInit, AfterViewInit, AfterContentInit, OnDestroy {
  colLength = 0;
  hosts: string[] = [];
  flowItems: any[] = [];
  selectedIndex: number = -1;
  @Input() set data(val: any) {
    this.colLength = val?.nodes?.length || 0;
    this.hosts = val?.nodes || [];
    this.flowItems = val?.flows || [];
    setTimeout(() => {
      Functions.emitWindowResize();
      this.cdr.detectChanges();
    }, 1500);
  }

  private updatesSub?: Subscription;

  constructor(
    private cdr: ChangeDetectorRef,
    private wiregasmService:WiregasmService
  ) { }

  ngOnInit() {
    this.refreshFromService();
    this.updatesSub = this.wiregasmService.updates.subscribe(() => this.refreshFromService());
  }

  ngOnDestroy() {
    this.updatesSub?.unsubscribe();
  }

  private refreshFromService() {
    const nodes = this.wiregasmService.getHosts();
    const flows: any[] = this.wiregasmService.getFlowItems();
    this.colLength = nodes?.length || 0;
    this.hosts = nodes || [];
    this.flowItems = flows || [];
    setTimeout(() => {
      Functions.emitWindowResize();
      this.cdr.detectChanges();
    }, 150);
  }
  ngAfterContentInit() {
    setTimeout(() => {
      Functions.emitWindowResize();
      this.cdr.detectChanges();
    }, 650)
  }
  ngAfterViewInit() {
    setTimeout(() => {
      this.cdr.detectChanges();
    }, 650)
  }
  getFrom(n: number[]) {
    const [a, b] = n;
    return Math.min(a, b);
  }
  getTo(n: number[]) {
    const [a, b] = n;
    return Math.max(a, b);
  }

  getDirection(n: number[]) {
    const [a, b] = n;
    return a > b;
  }
  getColor(p: number[] = []) {
    return `#${hash(p.sort().toString(), 6)}`;
  }
  setSelected(index: number) {
    this.selectedIndex = index;
    this.cdr.detectChanges();
  }
  getSelected(index: number) {
    return this.selectedIndex === index;
  }
}
