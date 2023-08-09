//https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/highcharts/demo/column-stacked

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
  selector: 'app-r-trends-chart',
  templateUrl: './r-trends-chart.component.html',
  styleUrls: ['./r-trends-chart.component.css'],
})
export class RTrendsChartComponent implements OnInit {
  updateFlag = false;
  tickerSubmittedValue: any;
  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: any;
  colors_modified=[];
  

  constructor(
    private service: GetdataService,
    private sharedDataService: SharedDataService
  ) {}

  ngOnInit(): void {
    this.colors_modified[0]='#006400';
    this.colors_modified[1]='#3cd070';
    this.colors_modified[2]='#cca01d';
    this.colors_modified[3]='#ff6961';
    this.colors_modified[4]='#8b4513';
    this.sharedDataService.stockSearchSymbol$.subscribe((data: any) => {
      this.tickerSubmittedValue = data;
      this.service
        .getCompanyRTrendsData(this.tickerSubmittedValue)
        .subscribe((data: any) => {
          this.rTrendsChart(data);
        });
    });
  }

  rTrendsChart(data: any) {
    this.chartOptions = {
      chart: {
        type: 'column',
        marginBottom:40,
        
      },

      lang: {
          noData: 'No data is available in the chart'
      },
      
      colors:this.colors_modified,
      title: {
        text: 'Recommendation Trends',
      },
      xAxis:[ {
        categories: [
          data[0]['period'],
          data[1]['period'],
          data[2]['period'],
          data[3]['period'],
        ],
      },{
        //to set the x axis label position
        labels:{
          y:-10,
          x: 60
        }
      }],
      yAxis: {
        min: 0,
        title: {
          text: '#Analysis',
          align:'high'
        },
        stackLabels: {
          enabled: false,
          style: {
            fontWeight: 'bold',
            color:
              // theme
              (Highcharts.defaultOptions.title.style &&
                Highcharts.defaultOptions.title.style.color) ||
              'gray',
          },
        },
      },
      legend: {
        align: 'center',
        x: -30,
        verticalAlign: 'bottom',
        y: 20,
        floating: true,
        backgroundColor:
          Highcharts.defaultOptions.legend.backgroundColor || 'white',
        // borderColor: '#CCC',
        // borderWidth: 1,
        shadow: false,
      },
      tooltip: {
        headerFormat: '<b>{point.x}</b><br/>',
        pointFormat: '{series.name}: {point.y}',
      },

        responsive: {
    rules: [{
      condition: {
        maxWidth: 500
      },
      chartOptions: {
        chart: {
          marginBottom:120,
          
        }
      }
    }]
  },

      plotOptions: {
        column: {
          stacking: 'normal',
          dataLabels: {
            enabled: true,
            minPointLength: 100,
          },

        },
      },
      	
      series: [
        {
          name: 'Strong Buy',
          data: [
            data[0]['strongBuy'],
            data[1]['strongBuy'],
            data[2]['strongBuy'],
            data[3]['strongBuy'],
          ],
        },
        {
          name: 'Buy',
          data: [
            data[0]['buy'],
            data[1]['buy'],
            data[2]['buy'],
            data[3]['buy'],
          ],
        },
        {
          name: 'Hold',
          data: [
            data[0]['hold'],
            data[1]['hold'],
            data[2]['hold'],
            data[3]['hold'],
          ],
        },
        {
          name: 'Sell',
          data: [
            data[0]['sell'],
            data[1]['sell'],
            data[2]['sell'],
            data[3]['sell'],
          ],
        },
        {
          name: 'Strong Sell',
          data: [
            data[0]['strongSell'],
            data[1]['strongSell'],
            data[2]['strongSell'],
            data[3]['strongSell'],
          ],
        },
      ],
    };
  }
}
