declare var require: any;
import { Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts/highstock';
import { Options } from 'highcharts/highstock';

import IndicatorsCore from 'highcharts/indicators/indicators';
import IndicatorZigzag from 'highcharts/indicators/zigzag';
import { GetdataService } from 'src/app/service/getdata.service';
import { SharedDataService } from 'src/app/service/shared-data.service';
import { LoadingService } from 'src/app/service/loading.service';
import { MethodCall } from '@angular/compiler';
IndicatorsCore(Highcharts);
IndicatorZigzag(Highcharts);

@Component({
  selector: 'app-historical-charts',
  templateUrl: './historical-charts.component.html',
  styleUrls: ['./historical-charts.component.css'],
})
export class HistoricalChartsComponent implements OnInit {
  updateFlag = false;
  Highcharts: typeof Highcharts = Highcharts;
  ohlc = [];
  volume = [];
  tickerSubmittedValue: any;
  myFlag: boolean;
  chartOptions: any;
  constructor(
    private service: GetdataService,
    private sharedDataService: SharedDataService
  ) {}

  ngOnInit(): void {
    let indicators = require('highcharts/indicators/indicators');
    indicators(Highcharts);
    var vbp = require('highcharts/indicators/volume-by-price');
    vbp(Highcharts);
    this.sharedDataService.stockSearchSymbol$.subscribe((data: any) => {
      this.myFlag = false;
      this.tickerSubmittedValue = data;
      this.service
        .getCompanyHistoricalData(this.tickerSubmittedValue)
        .subscribe((data: any) => {
          this.dataLoad(data);
        });
    });
  }

  dataLoad(data: any) {
    var length = data[`c`].length;
    this.ohlc = [];
    this.volume = [];
    for (let i = 0; i < length; i++) {
      //console.log('high');
      this.ohlc.push([
        data['t'][i] * 1000,
        data['o'][i],
        data['h'][i],
        data['l'][i],
        data['c'][i],
      ]);
      this.volume.push([data['t'][i] * 1000, data['v'][i]]);
    }
    // console.log('ohlc', this.ohlc);
    // console.log('volume', this.volume);
    this.loadChart();
  }

  // this.service.getCompanyPeersData(keyTicker).subscribe((data: any) => {
  //       //console.log('company peers data', data[0]);
  //       this.companyPeersArray = data;
  //     });
  loadChart() {
    this.chartOptions = {
      title: {
        text: this.tickerSubmittedValue + ' Historical',
      },

      lang: {
          noData: 'No data is available in the chart'
      },

      subtitle: {
        text: 'With SMA and Volume by Price technical indicators',
      },
      
      rangeSelector:{
        selected:2,
        dropdown:'never',
      },

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
          name: this.tickerSubmittedValue,
          id: this.tickerSubmittedValue,
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
          linkedTo: this.tickerSubmittedValue,
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
          linkedTo: this.tickerSubmittedValue,
          zIndex: 1,
          marker: {
            enabled: false,
          },
        },
      ],
    };
   this.myFlag = true;
  }
}
