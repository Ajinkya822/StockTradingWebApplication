//jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/highcharts/demo/line-basic
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
  selector: 'app-earning-chart',
  templateUrl: './earning-chart.component.html',
  styleUrls: ['./earning-chart.component.css'],
})
export class EarningChartComponent implements OnInit {
  Highcharts: typeof Highcharts = Highcharts;
  tickerSubmittedValue: any;
  chartOptions: any;
  updateFlag = false;
  surprise1:any;
  surprise2:any;
  surprise3:any;
  surprise4:any;
  constructor(
    private service: GetdataService,
    private sharedDataService: SharedDataService
  ) {}

  ngOnInit(): void {
    this.sharedDataService.stockSearchSymbol$.subscribe((data: any) => {
      this.tickerSubmittedValue = data;
      this.service
        .getCompanyEarningData(this.tickerSubmittedValue)
        .subscribe((data: any) => {
          this.earningDataChart(data);
        });
    });
  }

  // // data: [
  //           [data[0]['period'], data[0]['actual']],
  //           [data[1]['period'], data[1]['actual']],
  //           [data[2]['period'], data[2]['actual']],
  //           [data[3]['period'], data[3]['actual']],
  //         ],
  //       },
  //       {
  //         name: 'Estimate',
  //         data: [
  //           [data[0]['period'], data[0]['estimate']],
  //           [data[1]['period'], data[1]['estimate']],
  //           [data[2]['period'], data[2]['estimate']],
  //           [data[3]['period'], data[3]['estimate']],
  // //         ],

  earningDataChart(data: any) {
    // console.log("typing",data[0]['period']);
    if(data[0]['surprise']!=null && data[0]['surprise']!=undefined){
      this.surprise1=data[0]['surprise'];
    }
    else{
      this.surprise1=0;
    }

    if(data[1]['surprise']!=null && data[1]['surprise']!=undefined){
      this.surprise2=data[1]['surprise'];
    }
    else{
      this.surprise2=0;
    }

    if(data[2]['surprise']!=null && data[2]['surprise']!=undefined){
      this.surprise3=data[2]['surprise'];
    }
    else{
      this.surprise3=0;
    }

    if(data[3]['surprise']!=null && data[3]['surprise']!=undefined){
      this.surprise4=data[3]['surprise'];
    }
    else{
      this.surprise4=0;
    }

    this.chartOptions = {
      
      chart: {
        type: 'spline',
        
    },

     lang: {
          noData: 'No data is available in the chart'
      },

      title: {
        text: 'Historical EPS Surprises',
      },

      yAxis: {
        title: {
          text: 'Quarterly EPS',
        },
      },

      xAxis: {
        //  type:'category',
        categories: [data[0]['period']+"<br>Surprise: "+this.surprise1, data[1]['period']+"<br>Surprise: "+this.surprise2 , data[2]['period']+"<br>Surprise: "+this.surprise3 , data[3]['period']+"<br>Surprise: "+this.surprise4],
      },

      legend: {
        layout: 'horizontal',
        align: 'center',
        horizontalAlign: 'middle',
        
      },

      tooltip:{
        shared:true,
      },

      plotOptions: {
        series: {
          label: {
            connectorAllowed: false,
          },
          
        },
        // tooltip:{
        //   shared: true,
        //   // pointFormat: '{series.name}: {point.x}', 'Surprise: '
        // }
      },

      series: [
        {
          name: 'Actual',
          data: [
            [data[0]['period'], data[0]['actual']],
            [data[1]['period'], data[1]['actual']],
            [data[2]['period'], data[2]['actual']],
            [data[3]['period'], data[3]['actual']],
          ],
        },
        {
          name: 'Estimate',
          data: [
            [data[0]['period'], data[0]['estimate']],
            [data[1]['period'], data[1]['estimate']],
            [data[2]['period'], data[2]['estimate']],
            [data[3]['period'], data[3]['estimate']],
          ],
        },
      ],

      responsive: {
        rules: [
          {
            condition: {
              maxWidth: 500,
            },
            chartOptions: {
              legend: {
                layout: 'horizontal',
                align: 'center',
                verticalAlign: 'bottom',
              },
            },
          },
        ],
      },
    };
  }
}
