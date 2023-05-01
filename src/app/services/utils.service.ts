import { Injectable } from '@angular/core';
import { BarChartComponent } from '../shared-components/bar-chart/bar-chart.component';
import { LineChartComponent } from '../shared-components/line-chart/line-chart.component';
import { PieChartComponent } from '../shared-components/pie-chart/pie-chart.component';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  constructor() { }
  Page1Components = [
    {
      name: '折線圖',
      img: './assets/line.jpg',
      size: 'col-xl-6 col-12',
      val: LineChartComponent,
      disabled: true,
    },
    {
      name: '長條圖',
      img: './assets/bar.jpg',
      size: 'col-xl-3 col-lg-6 col-12',
      val: BarChartComponent,
      disabled: true,
    },
  ];

  Page2Components = [
    {
      name: '圓餅圖',
      img: './assets/pie.jpg',
      size: 'col-xl-3 col-lg-6 col-12',
      val: PieChartComponent,
      disabled: true,
    }
  ];

  getData(name, year) {
    if (name === '折線圖') {
      const dict = {
        2023: [3, 5, 4, 6, 7, 7, 7, 7, 7, 7, 7, 7],
        2022: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        2021: [13, 15, 14, 16, 17, 19, 15, 11, 12, 9, 6, 3],
      }
      const data = {
        year: year,
        xAxis: Array.from([...Array(12).keys()].map(e => e + 1)),
        lines: [
          { 'name': '使用率', 'values': dict[year] }
        ],
      }
      return data;
    } else if (name === '長條圖') {
      const dict = {
        2023: [3, 5, 4, 6, 7, 9, 15, 11, 12, 9, 6, 3],
        2022: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        2021: [13, 15, 14, 16, 17, 19, 15, 11, 12, 9, 6, 3],
      }
      const data = {
        year: year,
        xType: 'category',
        yType: 'value',
        xAxis: Array.from([...Array(12).keys()].map(e => e + 1)),
        yAxis: dict[year],
      }
      return data;
    }  else {
      const dict = {
        2023: [10, 90],
        2022: [40, 60],
        2021: [60, 40],
      }
      const data = {
        year: year,
        legend: ['已註冊', '未註冊'],
        data: dict[year]
      }
      return data;
    }
  }

  getAllComponents() {
    return [...this.Page1Components, ...this.Page2Components];
  }
}
