import { Component, OnInit } from '@angular/core';
import { GetdataService } from 'src/app/service/getdata.service';
import { SharedDataService } from 'src/app/service/shared-data.service';
import { LoadingService } from 'src/app/service/loading.service';
import { Router,RouterModule } from '@angular/router';


import * as Highcharts from 'highcharts';

@Component({
  selector: 'app-all-tabs',
  templateUrl: './all-tabs.component.html',
  styleUrls: ['./all-tabs.component.css'],
})
export class AllTabsComponent implements OnInit {
  highPrice: any;
  lowPrice: any;
  openPrice: any;
  prevClose: any;
  ipoStartDate: any;
  industry: any;
  webpage: any;
  redditMention: any;
  redditPositiveMention: any;
  redditNegativeMention: any;
  twitterMention: any;
  twitterPositiveMention: any;
  twitterNegativeMention: any;
  tickerSubmittedValue: any;
  companyPeersArray: [];
  highcharts = Highcharts;
  temp_newsleftImage = [];
  temp_newsleftHeadline = [];
  temp_newsrightImage = [];
  temp_newsrightHeadline = [];
  temp_newsleftSource = [];
  temp_newsleftDate = [];
  temp_newsleftSummary = [];
  temp_newsleftUrl = [];
  temp_newsrightSource = [];
  temp_newsrightDate = [];
  temp_newsrightSummary = [];
  temp_newsrightUrl = [];
  newsImageLeft: any;
  newsHeadlineLeft: any;
  chartOptions: any;
  chartOptions_history: any;
  modalNewsSource: any;
  modalNewsDate: any;
  modalNewsHeadline: any;
  modalNewsSummary: any;
  modalNewsUrl: any;
  isNewsOdd=false;
  fulldateTime:any;
  
  

  constructor(
    private service: GetdataService,
    private sharedDataService: SharedDataService,
    public loader: LoadingService,
    private router: Router
    
  ) {}

  ngOnInit(): void {
    this.isNewsOdd=false;
    this.sharedDataService.stockSearchSymbol$.subscribe((data: any) => {
      this.tickerSubmittedValue = data;

      this.displayCompanyPeersData(this.tickerSubmittedValue);
      this.displayCompanyNewsData(this.tickerSubmittedValue);
      this.displayCompanySocialSentimentData(this.tickerSubmittedValue);
    });

    this.sharedDataService.latestPriceDetailsHighprice$.subscribe(
      (data: any) => {
        this.highPrice = data;
      }
    );
    this.sharedDataService.latestPriceDetailsLowprice$.subscribe(
      (data: any) => {
        this.lowPrice = data;
      }
    );
    this.sharedDataService.latestPriceDetailsOpenprice$.subscribe(
      (data: any) => {
        this.openPrice = data;
      }
    );
    this.sharedDataService.latestPriceDetailsPrevClose$.subscribe(
      (data: any) => {
        this.prevClose = data;
      }
    );

    this.sharedDataService.aboutCompanySummaryTabipoStartDate$.subscribe(
      (data: any) => {
        this.ipoStartDate = data;
      }
    );

    this.sharedDataService.aboutCompanySummaryTabindustry$.subscribe(
      (data: any) => {
        this.industry = data;
      }
    );

    this.sharedDataService.aboutCompanySummaryTabwebpage$.subscribe(
      (data: any) => {
        this.webpage = data;
      }
    );
  }

  

  displayCompanyPeersData(keyTicker) {
    this.service.getCompanyPeersData(keyTicker).subscribe((data: any) => {
      this.companyPeersArray = data;
    });
  }

  displayCompanyNewsData(keyTicker) {
    this.service.getCompanyNewsData(keyTicker).subscribe((data: any) => {
     // console.log('length is', data.length);
      var maxIndex = data.length;
      var parentIndex = 0;
      var totalCounter = 0;
      var leftIndex = 0;
      var rightIndex = 0;
      var evenFlag = true;
      this.temp_newsleftHeadline = [];
      this.temp_newsleftImage = [];
      this.temp_newsrightHeadline = [];
      this.temp_newsrightImage = [];

      while (parentIndex < maxIndex) {
        if (data[parentIndex]['image'] != '' && data[parentIndex]['headline'] != '') {
          totalCounter++;
          
            this.temp_newsleftHeadline[leftIndex] =data[parentIndex]['headline'];
            this.temp_newsleftImage[leftIndex] = data[parentIndex]['image'];
            this.temp_newsleftSource[leftIndex] = data[parentIndex]['source'];
            this.temp_newsleftSummary[leftIndex] = data[parentIndex]['summary'];
            this.temp_newsleftDate[leftIndex] = data[parentIndex]['datetime'];
            this.temp_newsleftUrl[leftIndex] = data[parentIndex]['url'];
            leftIndex++;
        }
        parentIndex++;
        if (totalCounter == 20) {
          break;
        }
      }
      
    });
  }


  //   displayCompanyNewsData(keyTicker) {
  //   this.service.getCompanyNewsData(keyTicker).subscribe((data: any) => {
  //     console.log('length is', data.length);
  //     var maxIndex = data.length;
  //     var parentIndex = 0;
  //     var totalCounter = 0;
  //     var leftIndex = 0;
  //     var rightIndex = 0;
  //     var evenFlag = true;
  //     this.temp_newsleftHeadline = [];
  //     this.temp_newsleftImage = [];
  //     this.temp_newsrightHeadline = [];
  //     this.temp_newsrightImage = [];

  //     while (parentIndex < maxIndex) {
  //       if (data[parentIndex]['image'] != '' && data[parentIndex]['headline'] != '') {
  //         totalCounter++;
  //         if (evenFlag) {
  //           this.temp_newsleftHeadline[leftIndex] =data[parentIndex]['headline'];
  //           this.temp_newsleftImage[leftIndex] = data[parentIndex]['image'];
  //           this.temp_newsleftSource[leftIndex] = data[parentIndex]['source'];
  //           this.temp_newsleftSummary[leftIndex] = data[parentIndex]['summary'];
  //           this.temp_newsleftDate[leftIndex] = data[parentIndex]['datetime'];
  //           this.temp_newsleftUrl[leftIndex] = data[parentIndex]['url'];
  //           evenFlag = false;
  //           leftIndex++;
  //         } 
  //         else {
  //           this.temp_newsrightHeadline[rightIndex] =data[parentIndex]['headline'];
  //           this.temp_newsrightImage[rightIndex] = data[parentIndex]['image'];
  //           this.temp_newsrightSource[rightIndex] = data[parentIndex]['source'];
  //           this.temp_newsrightSummary[rightIndex] =data[parentIndex]['summary'];
  //           this.temp_newsrightDate[rightIndex] = data[parentIndex]['datetime'];
  //           this.temp_newsrightUrl[rightIndex] = data[parentIndex]['url'];
  //           evenFlag = true;
  //           rightIndex++;
  //         }
  //       }
  //       parentIndex++;
  //       if (totalCounter == 40) {
  //         break;
  //       }
  //     }
      
  //   });
  // }

  displayCompanySocialSentimentData(keyTicker) {
    this.service
      .getCompanySocialSentimentData(keyTicker)
      .subscribe((data: any) => {
       // console.log('Calling Social Sentiment data');
        this.redditMention = 0;
        this.redditPositiveMention = 0;
        this.redditNegativeMention = 0;
        this.twitterMention = 0;
        this.twitterPositiveMention = 0;
        this.twitterNegativeMention = 0;
        for (let i = 0; i < data['reddit'].length; i++) {
          if (
            data['reddit'][i]['mention'] != undefined &&
            data['reddit'][i]['mention'] != null &&
            data['reddit'][i]['mention'] != ''
          ) {
            this.redditMention += data['reddit'][i]['mention'];
          }

          if (
            data['reddit'][i]['positiveMention'] != undefined &&
            data['reddit'][i]['positiveMention'] != null &&
            data['reddit'][i]['positiveMention'] != ''
          ) {
            this.redditPositiveMention += data['reddit'][i]['positiveMention'];
          }

          if (
            data['reddit'][i]['negativeMention'] != undefined &&
            data['reddit'][i]['negativeMention'] != null &&
            data['reddit'][i]['negativeMention'] != ''
          ) {
            this.redditNegativeMention += data['reddit'][i]['negativeMention'];
          }
        }

        for (let i = 0; i < data['twitter'].length; i++) {
          if (
            data['twitter'][i]['mention'] != undefined &&
            data['twitter'][i]['mention'] != null &&
            data['twitter'][i]['mention'] != ''
          ) {
            this.twitterMention += data['twitter'][i]['mention'];
          }

          if (
            data['twitter'][i]['positiveMention'] != undefined &&
            data['twitter'][i]['positiveMention'] != null &&
            data['twitter'][i]['positiveMention'] != ''
          ) {
            this.twitterPositiveMention +=
              data['twitter'][i]['positiveMention'];
          }

          if (
            data['twitter'][i]['negativeMention'] != undefined &&
            data['twitter'][i]['negativeMention'] != null &&
            data['twitter'][i]['negativeMention'] != ''
          ) {
            this.twitterNegativeMention +=
              data['twitter'][i]['negativeMention'];
          }
        }
        // console.log(
        //   this.redditMention,
        //   this.redditPositiveMention,
        //   this.redditNegativeMention,
        //   this.twitterMention,
        //   this.twitterPositiveMention,
        //   this.twitterNegativeMention
        // );
      });
  }
  openModalLeft(i: any) {
    this.modalNewsSource = this.temp_newsleftSource[i];
    this.modalNewsHeadline = this.temp_newsleftHeadline[i];
    this.modalNewsDate = this.temp_newsleftDate[i];
    var millisecondsmodalNewsDate = this.modalNewsDate * 1000;
    var dateObj = new Date(millisecondsmodalNewsDate);
    var day = dateObj.toLocaleString('en-CA', { day: 'numeric' });
    var month = dateObj.toLocaleString('en-CA', { month: 'long' });
    var year = dateObj.toLocaleString('en-CA', { year: 'numeric' });
    this.fulldateTime =month+' '+day+', '+year;
    this.modalNewsSummary = this.temp_newsleftSummary[i];
    this.modalNewsUrl = this.temp_newsleftUrl[i];
    
  }
  openModalRight(i: any) {
    this.modalNewsSource = this.temp_newsleftSource[i];
    this.modalNewsHeadline = this.temp_newsleftHeadline[i];
    this.modalNewsDate = this.temp_newsleftDate[i];
    var millisecondsmodalNewsDate = this.modalNewsDate * 1000;
    var dateObj = new Date(millisecondsmodalNewsDate);
    var day = dateObj.toLocaleString('en-CA', { day: 'numeric' });
    var month = dateObj.toLocaleString('en-CA', { month: 'long' });
    var year = dateObj.toLocaleString('en-CA', { year: 'numeric' });
    this.fulldateTime =month+' '+day+', '+year;
    this.modalNewsSummary = this.temp_newsleftSummary[i];
    this.modalNewsUrl = this.temp_newsleftUrl[i];
  }

   check(){
    // console.log("in check function returning false");
    return false;
  }

  listenToMe(item){
    //console.log("I am listening");
   // this.router.navigateByUrl('/search/fdx');
   // this.router.navigate(['/search','AMZN']);
    //this.router.navigateByUrl('search/AMZN');
   // this.sharedDataService.setCompanyPeerDataToClick(item);
  //  this.router.navigate(['/search',item]);
    //this.router.navigate(['search/home',item]);
   // window.location.reload();
  //  window.location.href='http://localhost:4200/#/search/home';
  //  this.router.navigate(['search/home',item]);
  //   window.location.href='http://localhost:4200/#/search/home';
  //  this.router.navigate(['search/home',item]);
    
     
  // window.location.reload();
    
  }

  getPeer(peer: string) {
    return ['/search', peer]
  }
}
