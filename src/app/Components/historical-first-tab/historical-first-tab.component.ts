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
import { Subscription, timer } from 'rxjs';
IndicatorsCore(Highcharts);
IndicatorZigzag(Highcharts);

@Component({
  selector: 'app-historical-first-tab',
  templateUrl: './historical-first-tab.component.html',
  styleUrls: ['./historical-first-tab.component.css']
})
export class HistoricalFirstTabComponent implements OnInit {
  updateFlag = false;
  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: any;
  myFlag: boolean;
  tickerSubmittedValue: any;
  change:any;
  dateAndTime:any;
  dataToFeed=[];
  colorLineChart:any;
  chartTimer:Subscription;
  date_time:any;
  currentLATime:any;
  constructor(
    private service: GetdataService,
    private sharedDataService: SharedDataService
    ) 
  { }

  ngOnInit(): void {
    
    this.sharedDataService.stockSearchSymbol$.subscribe((dataTickerValue:any)=>{
      this.tickerSubmittedValue=dataTickerValue;
      // if(this.chartTimer){
      //  // console.log("unsubscribing first tab hourle chart");
      //   this.chartTimer.unsubscribe();
      // }
      this.getMarketOpenTime(this.tickerSubmittedValue);
    })  
    
    
    
    
    // this.service
    //   .getStockDetailsPriceChange(value_priceChange)
    //   .subscribe((data: any) => {
        
    //     this.change = data['d'].toFixed(2);
        
    //     this.dateAndTime = data['t'];
        
        
    //    // console.log('sent high price', this.highPrice);
    //   //  console.log("is market open", this.isMarketOpen);
    //     this.priceChangeProcessing();
    //   });
      
      
      
    //   this.sharedDataService.stockSearchSymbol$.subscribe((data: any) => {
    //   this.myFlag = false;
    //   this.tickerSubmittedValue = data;
    //   this.service
    //     .getCompanyHistoricalChartData(this.tickerSubmittedValue)
    //     .subscribe((data: any) => {
    //       this.dataloadForDailyChart(data);
    //     });
    // });
  }

  getMarketOpenTime(tickerSubmittedValue){

    if(this.chartTimer){
      console.log("disabling existing histo timer");
      this.chartTimer.unsubscribe();
    }
    
    this.chartTimer=timer(0,60000).subscribe(()=>{
        this.service.getStockDetailsPriceChange(tickerSubmittedValue).subscribe((data:any)=>{
        this.change=data['d'];
        this.dateAndTime=data['t'];
       // console.log("timer is activated for chart on first tab");
        this.date_time=data['t'];
        var millisecondsPriceChange = this.date_time * 1000;
        this.currentLATime=Date.now();
       // console.log("la time and old time", this.currentLATime, millisecondsPriceChange);
        if(this.currentLATime-millisecondsPriceChange>300000){
          if(this.chartTimer){
         //   console.log("unsubscribing first tab hourle chart");
            this.chartTimer.unsubscribe();
          }
        }
        
        this.service.getCompanyHistoricalChartData(this.tickerSubmittedValue, this.dateAndTime).subscribe((data:any)=>{
          this.dataloadForDailyChart(data);
        })
      })
    })

  }

  dataloadForDailyChart(data:any){
    // console.log("loading data for daily chart");
    var length = data[`c`].length;
    this.dataToFeed=[];
    if(this.change>0){
      this.colorLineChart='green';
    }
    else if(this.change<0){
      this.colorLineChart='red';
    }
    else{
      this.colorLineChart='black';
    }
    for(let i=0;i<length;i++){
      this.dataToFeed.push([data['t'][i]*1000,data['c'][i]]);
    }

    this.loadDailyChart();
  }

  loadDailyChart(){
    this.chartOptions={

      lang: {
          noData: 'No data is available in the chart'
      },

      title: {
        text: this.tickerSubmittedValue + ' Hourly Price Variation',
        style: {
            color: '#808080',
            
        },
      },
      navigator: {
            enabled: false
        },
      rangeSelector: {
    enabled: false
},

  
      
      series:[
        {
          data:this.dataToFeed,
          type:'line',
          color: this.colorLineChart,
        },
      ],
    }

    
  }
}
