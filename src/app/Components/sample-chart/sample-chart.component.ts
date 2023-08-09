declare var require: any;
import { Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts/highstock';
import { Options } from 'highcharts/highstock';

import IndicatorsCore from 'highcharts/indicators/indicators';
import IndicatorZigzag from 'highcharts/indicators/zigzag';
IndicatorsCore(Highcharts);
IndicatorZigzag(Highcharts);

@Component({
  selector: 'app-sample-chart',
  templateUrl: './sample-chart.component.html',
  styleUrls: ['./sample-chart.component.css'],
})
export class SampleChartComponent implements OnInit {
  Highcharts: typeof Highcharts = Highcharts;
  ohlc = [];
  volume = [];
  constructor() {}

  ngOnInit(): void {
    let indicators = require('highcharts/indicators/indicators');
    indicators(Highcharts);
    var vbp = require('highcharts/indicators/volume-by-price');
    vbp(Highcharts);
    this.ohlc.push([1584538200000, 58.94, 61.5, 58.28, 60.67]);
    this.ohlc.push([1584624600000, 57.94, 60.5, 57.28, 59.67]);
    this.ohlc.push([158471100000, 56.94, 59.5, 56.28, 58.67]);
    this.ohlc.push([1584970200000, 56.94, 59.5, 53.28, 60.67]);
    this.volume.push([1584538200000, 300233600]);
    this.volume.push([1584624600000, 271857200]);
    this.volume.push([1584711000000, 401693200]);
    this.volume.push([1584970200000, 336752800]);
  }

  chartOptions: Options = {
    yAxis: [
      {
        labels: {
          align: 'right',
          x: -3,
        },
        title: {
          text: 'OHLC',
        },
        height: '60%',
        lineWidth: 2,
        resize: {
          enabled: true,
        },
      },
      {
        labels: {
          align: 'right',
          x: -3,
        },
        title: {
          text: 'Volume',
        },
        top: '65%',
        height: '35%',
        offset: 0,
        lineWidth: 2,
      },
    ],

    tooltip: {
      split: true,
    },

    series: [
      {
        type: 'candlestick',
        name: 'AAPL',
        id: 'aapl',
        zIndex: 2,
        data: this.ohlc,
      },
      {
        type: 'column',
        name: 'Volume',
        id: 'volume',
        data: this.volume,
        yAxis: 1,
      },
      {
        type: 'vbp',
        linkedTo: 'aapl',
        params: {
          volumeSeriesID: 'volume',
        },
        dataLabels: {
          enabled: false,
        },
        zoneLines: {
          enabled: false,
        },
      },
      {
        type: 'sma',
        linkedTo: 'aapl',
        zIndex: 1,
        marker: {
          enabled: false,
        },
      },
    ],
  };
}
