import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class SharedDataService {
  private source_ = new BehaviorSubject<any>(null);
  stockSearchSymbol$ = this.source_.asObservable();
  private source_1 = new BehaviorSubject<boolean>(false);
  tickerValidation$ = this.source_1.asObservable();
  private source_2 = new BehaviorSubject<boolean>(false);
  homePageLoaderVariable$ = this.source_2.asObservable();
  private source_3 = new BehaviorSubject<any>(0);
  latestPriceDetailsHighprice$ = this.source_3.asObservable();
  private source_4 = new BehaviorSubject<any>(0);
  latestPriceDetailsLowprice$ = this.source_4.asObservable();
  private source_5 = new BehaviorSubject<any>(0);
  latestPriceDetailsOpenprice$ = this.source_5.asObservable();
  private source_6 = new BehaviorSubject<any>(0);
  latestPriceDetailsPrevClose$ = this.source_6.asObservable();
  private source_7 = new BehaviorSubject<any>(0);
  aboutCompanySummaryTabipoStartDate$ = this.source_7.asObservable();
  private source_8 = new BehaviorSubject<any>(0);
  aboutCompanySummaryTabindustry$ = this.source_8.asObservable();
  private source_9 = new BehaviorSubject<any>(0);
  aboutCompanySummaryTabwebpage$ = this.source_9.asObservable();
  private source_10 = new BehaviorSubject<any>(0);
  companyPeerDataToClick$ = this.source_10.asObservable();
  private source_11 = new BehaviorSubject<any>(0);
  handleDeletionFromWatchlist$ = this.source_11.asObservable();
  private source_12 = new BehaviorSubject<boolean>(false);
  toCheckIfMarketIsOpen$ = this.source_12.asObservable();
  private source_13 = new BehaviorSubject<boolean>(false);
  toDisableSellButton$ = this.source_13.asObservable();
  
  constructor() {}

  sendMessage(message: any) {
   // console.log('Step 3: I am in shared data service reading value', message);
    this.source_.next(message);
  }

  setStockExistVariable(stockExistGlobalVariable: boolean) {
    // console.log(
    //   'Step number 7: Recieved value of stockexistglobalvariable on sharedDataService',
    //   stockExistGlobalVariable
    // );

    this.source_1.next(stockExistGlobalVariable);
  }
  setHomepageLoaderVariable(homepageLoaderVariable: any) {
    this.source_2.next(homepageLoaderVariable);
  }
  setLatestPriceDetailsSummaryTabHighprice(
    latestPriceDetailsHighpriceVar: any
  ) {
    this.source_3.next(latestPriceDetailsHighpriceVar);
  }
  setLatestPriceDetailsSummaryTabLowprice(latestPriceDetailslowpriceVar: any) {
    this.source_4.next(latestPriceDetailslowpriceVar);
  }
  setLatestPriceDetailsSummaryTabOpenprice(
    latestPriceDetailsOpenpriceVar: any
  ) {
    this.source_5.next(latestPriceDetailsOpenpriceVar);
  }
  setLatestPriceDetailsSummaryTabPrevClose(
    latestPriceDetailsPrevCloseVar: any
  ) {
    this.source_6.next(latestPriceDetailsPrevCloseVar);
  }
  setAboutCompanySummaryTabipoStartDate(ipoStartDateVar: any) {
    this.source_7.next(ipoStartDateVar);
  }

  setAboutCompanySummaryTabIndustry(industryVar: any) {
    this.source_8.next(industryVar);
  }

  setAboutCompanySummaryTabwebpage(webpageVar: any) {
    this.source_9.next(webpageVar);
  }
  setCompanyPeerDataToClick(companypeerdata:any){
    this.source_10.next(companypeerdata);
  }
  handleDeletionFromWatchlist(watchListDeletionMessage:any){
    this.source_11.next(watchListDeletionMessage);
  }
  sendMarketOpenStatus(isOpen:boolean){
    this.source_12.next(isOpen);
  }
  sendInfoToDisableSellButton(toDisable:boolean){
    this.source_13.next(toDisable);
  }
}
