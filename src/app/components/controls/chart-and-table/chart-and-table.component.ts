import { ChartType, ChartData, TypeOfChart } from './../flexible-chart/flexible-chart.component';
import { Component, Input, OnInit } from '@angular/core';
import { hash } from '@app/helper/functions';

@Component({
  selector: 'chart-and-table',
  templateUrl: './chart-and-table.component.html',
  styleUrls: ['./chart-and-table.component.scss']
})
export class ChartAndTableComponent implements OnInit {
  private _data: any = [];
  title: string = '';
  @Input() set data(val: any) {
    if (!val) {
      return;
    }

    // console.log({ val });
    const _data = val;
    const arrTitle: any[] = [];
    Object.entries(_data).forEach(([key, value]: any) => {
      if (Array.isArray(value)) {
        // console.log({ key, value });
        this._data = value || [];
      } else {
        // this.title += `${value}`;
        arrTitle.push(value);
      }
    });
    /**
     * get data for chart
     */
    //
    // console.log('this._data', this._data);
    var o: any = {};
    this._data.forEach((i: any) => {
      // console.log(i)
      Object.entries(i).map(([key, val]) => {
        if (typeof val === 'number') {
          if (!o[key]) {
            o[key] = [];
          }
          o[key].push(val);
        }
      });
    });
    this.chartData = [];
    Object.entries(o).forEach(([key, val]: any) => {
      this.chartData.push({
        typeOfChart: ChartType.AREA,
        color: `#${hash(key, 6)}`,
        name: key,
        data: val
      })
    });

    this.title = arrTitle.join(' | ')
  }
  getKeys(obj: any) {
    return Object.keys(obj);
  }
  get data(): any {
    return this._data;
  }
  chartData: ChartData[];
  constructor() {
    const rnd = () => Array.from({ length: Math.floor(Math.random() * 50) },
      (x, k) => Math.floor(Math.random() * 10 + 20));

    this.chartData = [
      {
        typeOfChart: ChartType.BAR,
        color: '#F00', data: [...rnd()]
      },
      // { color: '#0F0', data: [...rnd()]},
      // { color: '#00F', data: [...rnd()]},
      {
        typeOfChart: ChartType.AREA,
        color: '#FF0', data: [...rnd()]
      },
      {
        typeOfChart: ChartType.LINE,
        color: '#090', data: [...rnd()]
      },
    ];
  }

  ngOnInit() {
  }

}
