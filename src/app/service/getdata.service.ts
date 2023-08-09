import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class GetdataService {
  // tempurl = 'http://localhost:3000/showstuff';
  // homeurl = 'http://localhost:3000/stockdetails_1?';
  // stockdetailsurl = 'http://localhost:3000/stockdetails_2?';
  // stockDetailsUrlPriceChange = `http://localhost:3000/stockdetails_3priceChange?`;
  // stockDetailsUrlCompanyPeers = `http://localhost:3000/stockdetails_companypeers?`;
  // stockDetailsUrlNewsData = `http://localhost:3000/stockdetails_newsData?`;
  // stockDetailsUrlHistoricalData = `http://localhost:3000/stockdetails_historicalData?`;
  // stockDetailsUrlSocialSentimentData = `http://localhost:3000/stockdetails_socialSentimentData?`;
  // stockDetailsUrlRTrends = `http://localhost:3000/stockdetails_RTrendsData?`;
  // stockDetailsUrlEarning = `http://localhost:3000/stockdetails_EarningData?`;
  // stockDetailsUrlHistoricalChart = `http://localhost:3000/stockdetails_HistoricalChartData?`;


  homeurl = 'https://hw8april3final.wl.r.appspot.com/stockdetails_1?';
  stockdetailsurl = 'https://hw8april3final.wl.r.appspot.com/stockdetails_2?';
  stockDetailsUrlPriceChange = `https://hw8april3final.wl.r.appspot.com/stockdetails_3priceChange?`;
  stockDetailsUrlCompanyPeers = `https://hw8april3final.wl.r.appspot.com/stockdetails_companypeers?`;
  stockDetailsUrlNewsData = `https://hw8april3final.wl.r.appspot.com/stockdetails_newsData?`;
  stockDetailsUrlHistoricalData = `https://hw8april3final.wl.r.appspot.com/stockdetails_historicalData?`;
  stockDetailsUrlSocialSentimentData = `https://hw8april3final.wl.r.appspot.com/stockdetails_socialSentimentData?`;
  stockDetailsUrlRTrends = `https://hw8april3final.wl.r.appspot.com/stockdetails_RTrendsData?`;
  stockDetailsUrlEarning = `https://hw8april3final.wl.r.appspot.com/stockdetails_EarningData?`;
  stockDetailsUrlHistoricalChart = `https://hw8april3final.wl.r.appspot.com/stockdetails_HistoricalChartData?`;


  
  constructor(private httpclient: HttpClient) {}

  // getStuff() {
  //   var response = this.httpclient.get(this.tempurl);
  //   return response as any;
  // }
  // trialpurpose() {
  //   return this.httpclient
  //     .get('http://localhost:3000/showstuff')
  //     .pipe(map((response: []) => response.map((item) => item['symbol'])));
  // }

  stockSearchValidation(_stock_search_key: string) {
    // console.log(
    //   'Step number 5: In getData service for stock search ticker validation'
    // );
    var response0 = this.httpclient.get(
      this.stockdetailsurl + '_keystock_=' + _stock_search_key
    );
    return response0 as any;
  }

  getSearchDetails(_keyticker_: string) {
    var response1 = this.httpclient.get(
      this.stockdetailsurl + '_keystock_=' + _keyticker_
    );
    return response1 as any;
  }

  getStockDetails(_keyticker_: string) {
    return this.httpclient.get(this.homeurl + '_keystock_=' + _keyticker_);
  }

  getStockDetailsPriceChange(_keyticker_: string) {
    var response2 = this.httpclient.get(
      this.stockDetailsUrlPriceChange + '_keystock_=' + _keyticker_
    );
    return response2 as any;
  }

  getCompanyPeersData(_keyticker_: string) {
    var response = this.httpclient.get(
      this.stockDetailsUrlCompanyPeers + '_keystock_=' + _keyticker_
    );
    return response as any;
  }

  getCompanyNewsData(_keyticker_: string) {
    var response = this.httpclient.get(
      this.stockDetailsUrlNewsData + '_keystock_=' + _keyticker_
    );
    return response as any;
  }

  getCompanyHistoricalData(_keyticker_: string) {
    var response = this.httpclient.get(
      this.stockDetailsUrlHistoricalData + '_keystock_=' + _keyticker_
    );
    return response as any;
  }

  getCompanySocialSentimentData(_keyticker_: string) {
    var response = this.httpclient.get(
      this.stockDetailsUrlSocialSentimentData + '_keystock_=' + _keyticker_
    );
    return response as any;
  }

  getCompanyRTrendsData(_keyticker_: string) {
    var response = this.httpclient.get(
      this.stockDetailsUrlRTrends + '_keystock_=' + _keyticker_
    );
    return response as any;
  }

  getCompanyEarningData(_keyticker_: string) {
    var response = this.httpclient.get(
      this.stockDetailsUrlEarning + '_keystock_=' + _keyticker_
    );
    return response as any;
  }

  getCompanyHistoricalChartData(_keyticker_: string,toTime:any){
    var response = this.httpclient.get(
      this.stockDetailsUrlHistoricalChart + '_keystock_=' + _keyticker_+'&toTime='+toTime
    );
    return response as any;
  }
}
