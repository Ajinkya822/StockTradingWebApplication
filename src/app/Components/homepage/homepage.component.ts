import { Component, ComponentFactoryResolver, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { GetdataService } from 'src/app/service/getdata.service';
import { SharedDataService } from 'src/app/service/shared-data.service';
import { LoadingService } from 'src/app/service/loading.service';
import { ViewChild, ElementRef } from '@angular/core';
import { element } from 'protractor';
import {NgbAlert} from '@ng-bootstrap/ng-bootstrap';
import { interval, timer } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css'],
})
export class HomepageComponent implements OnInit {
  ticker: any;
  companyname: any;
  //loading$ = this.loader.loading$;
  loading$ = false;
  main_flag: boolean;
  exchange_: any;
  logourl: string;
  tickerSubmittedValue: any;
  last_price: any;
  change: any;
  percent_change: any;
  date_time: any;
  date_time_converted: any;
  marketStatus: any;
  temp_color: any;
  month: number;
  greenCarrotEnable: boolean;
  redCarrotEnable: boolean;
  highPrice: any;
  lowPrice: any;
  openPrice: any;
  prevClose: any;
  ipoStartDate: any;
  industry: any;
  webPage: any;
  logoFlag: boolean;
  stockQuantityToBuy:any;
  totalPriceStockToBuy:any;
  stockQuantityToSell:any;
  totalPriceStockToSell:any;
  totalPriceStockToSellForHTML:any;
  remainingWallet:any;
  totalMoneyWallet:any;
  watchListAddedstaticAlertClosed = true;
  watchListRemovedstaticAlertClosed=true;
  stockBoughtstaticAlertClosed=true;
  stockSoldstaticAlertClosed=true;
  warningStockAmountExceeded=false;
  warningStockToSellNotAvailable=false;
  flagForWatchlistStarIcon:any;
  loaderFlag=true;
  mainnnn=false;
  loaderFlagImage=true;
  sellButtonVisible=false;
  currentLATime:any;
  isMarketOpen:boolean;
  priceChangeTimer;
  tTimer;
  lastPriceFlag=false;
  susbcribeFlag=false;
  params:any;
  allDataLoaded=false;
  loaderToAllData=true;
  invalidTicker=false;
  watchlistDeletionHandleVariable:any;
  
  //to handle the alert for watchlist
  @ViewChild('staticAlertWatchlistAddedId', {static: false}) staticAlertWatchlistAddedId: NgbAlert;
  @ViewChild('staticAlertWatchlistRemovedId', {static: false}) staticAlertWatchlistRemovedId: NgbAlert;
  
  @ViewChild('staticAlertstockBoughtId', {static: false}) staticAlertstockBoughtId: NgbAlert; 
  @ViewChild('staticAlertstockSoldId', {static: false}) staticAlertstockSoldId: NgbAlert; 
  
  onStockQuantChangeBuy(event: any) { 
    
    this.totalMoneyWallet=JSON.parse(localStorage.getItem('WalletMoneyHTMLStorage'));
    this.portfolioTickerArrayLocal = JSON.parse(localStorage.getItem('portfolioTickerHTMLStorage')) || [];
    this.portfolioCompanyNameArrayLocal=JSON.parse(localStorage.getItem('portfolioCompanyNameHTMLStorage')) || [];
    this.portfolioStockQuantArrayLocal = JSON.parse(localStorage.getItem('portfolioStockQuantHTMLStorage')) || [];
    this.portfolioTotalCostArrayLocal = JSON.parse(localStorage.getItem('portfolioTotalCostHTMLStorage')) || [];
    
    this.stockQuantityToBuy = event.target.value;
    
    this.totalPriceStockToBuy=this.stockQuantityToBuy*this.last_price;
    
    //this.totalPriceStockToBuy=this.totalPriceStockToBuy.toFixed(2);
    this.totalPriceStockToBuy=Math.round((this.totalPriceStockToBuy+Number.EPSILON)*100)/100;
    this.totalPriceStockToBuy=this.totalPriceStockToBuy.toFixed(2);
    
    this.totalMoneyWallet=JSON.parse(localStorage.getItem('WalletMoneyHTMLStorage'));
    if(this.totalPriceStockToBuy<=0){
      (document.getElementById("buyButtonModal") as HTMLButtonElement).disabled = true;
    }
    else if(this.totalMoneyWallet-this.totalPriceStockToBuy<0){
      this.warningStockAmountExceeded=true;
      //document.getElementById("buyButton").disabled = true;
      (document.getElementById("buyButtonModal") as HTMLButtonElement).disabled = true;
    }
    else{
      this.warningStockAmountExceeded=false;
      //document.getElementById("buyButton").disabled = true;
      (document.getElementById("buyButtonModal") as HTMLButtonElement).disabled = false;
    }
  }
  
  onStockQuantChangeSell(event:any){
    this.totalMoneyWallet=JSON.parse(localStorage.getItem('WalletMoneyHTMLStorage'));
    this.portfolioTickerArrayLocal = JSON.parse(localStorage.getItem('portfolioTickerHTMLStorage')) || [];
    this.portfolioCompanyNameArrayLocal=JSON.parse(localStorage.getItem('portfolioCompanyNameHTMLStorage')) || [];
    this.portfolioStockQuantArrayLocal = JSON.parse(localStorage.getItem('portfolioStockQuantHTMLStorage')) || [];
    this.portfolioTotalCostArrayLocal = JSON.parse(localStorage.getItem('portfolioTotalCostHTMLStorage')) || [];
    this.stockQuantityToSell=event.target.value;
    this.totalPriceStockToSell=this.stockQuantityToSell*this.last_price;
   // this.totalPriceStockToSell=this.totalPriceStockToSell.toFixed(2);
   this.totalPriceStockToSell=Math.round((this.totalPriceStockToSell+Number.EPSILON)*100)/100;
   this.totalPriceStockToSellForHTML=this.totalPriceStockToSell.toFixed(2);
    //  this.totalPriceStockToSell=this.totalPriceStockToSell.toFixed(2);
    //if stock quantity present
    if(this.portfolioTickerArrayLocal.findIndex((element)=>element==this.ticker)!=-1) {
      var indexStockToSell=this.portfolioTickerArrayLocal.findIndex((element)=>element==this.ticker);
        // if stock quantity to sell is greater than exisiting
      if(this.stockQuantityToSell>this.portfolioStockQuantArrayLocal.at(indexStockToSell)){
        this.warningStockToSellNotAvailable=true;
        (document.getElementById("sellButtonModal") as HTMLButtonElement).disabled = true;
      }
        // stocks to sell are available
      else{
        this.warningStockToSellNotAvailable=false;
        (document.getElementById("sellButtonModal") as HTMLButtonElement).disabled = false;
      }
      
    }
    // stock quantity is not present
    else{
      this.warningStockToSellNotAvailable=true;
      (document.getElementById("sellButtonModal") as HTMLButtonElement).disabled = true;
    }

    if(this.totalPriceStockToSell<=0){
      (document.getElementById("sellButtonModal") as HTMLButtonElement).disabled = true;
    }
    
  }


  //totalMoneyWallet=JSON.parse(localStorage.getItem('WalletMoneyHTMLStorage')) || 25000;
  watchlistTickerArrayLocal = JSON.parse(localStorage.getItem('watchlistTickersHTMLStorage')) || [];

  watchlistCompanyNameArrayLocal = JSON.parse(localStorage.getItem('watchlistCompanyNamesHTMLStorage')) || [];

  portfolioTickerArrayLocal = JSON.parse(localStorage.getItem('portfolioTickerHTMLStorage')) || [];
  portfolioCompanyNameArrayLocal=JSON.parse(localStorage.getItem('portfolioCompanyNameHTMLStorage')) || [];
  portfolioStockQuantArrayLocal = JSON.parse(localStorage.getItem('portfolioStockQuantHTMLStorage')) || [];
  portfolioTotalCostArrayLocal = JSON.parse(localStorage.getItem('portfolioTotalCostHTMLStorage')) || [];

  public stockExistGlobalVariableHomepage: boolean;
  public homePageLoaderVariableGlobal: any;
  constructor(
    private service: GetdataService,
    private sharedDataService: SharedDataService,
    public loader: LoadingService,
    private router: Router,
  ) {
    
  }

  ngOnInit(): void {
    //localStorage.setItem("WalletMoneyHTMLStorage","25000");
    //this.totalMoneyWallet=JSON.parse(localStorage.getItem('WalletMoneyHTMLStorage')) || 25000;
    //this.portfolioTickerArrayLocal = JSON.parse(localStorage.getItem('portfolioTickerHTMLStorage')) || [];
    
    
    this.sharedDataService.handleDeletionFromWatchlist$.subscribe((data:any)=>{
      //console.log("I am reading")
      
      this.watchlistTickerArrayLocal = JSON.parse(localStorage.getItem('watchlistTickersHTMLStorage')) || [];
      this.watchlistCompanyNameArrayLocal = JSON.parse(localStorage.getItem('watchlistCompanyNamesHTMLStorage')) || [];
      this.watchListDeletionFunction();
    })

    this.sharedDataService.toDisableSellButton$.subscribe((data:boolean)=>{
      //console.log('reading data in homepage fo disable sell', data);
      if(data){
        this.sellButtonVisible=false;
      }
    })

    // console.log('Subscribing again to homepage');
    this.loaderToAllData=true;
    this.allDataLoaded=false;
    this.loader.loading$.subscribe((res) => this.loading$ = res);
    this.homePageLoaderVariableGlobal=false;
    this.sellButtonVisible=false;
    this.loaderFlagImage=true;
    this.mainnnn=false;
    this.loaderFlag=true;
    this.warningStockAmountExceeded=false;
    this.warningStockToSellNotAvailable=false;
    this.main_flag=false;
    this.logoFlag = false;
    this.sharedDataService.tickerValidation$.subscribe(
      (stockExistGlobalVariable) => {
        
        this.stockExistGlobalVariableHomepage = stockExistGlobalVariable;
        // console.log(
        //   'Step number 8 pre validator reading stockexistglobalvariable value',
        //   this.stockExistGlobalVariableHomepage
        // );
      }
    );

    this.sharedDataService.stockSearchSymbol$.subscribe((message: any) => {
      this.tickerSubmittedValue = message;
      // console.log("value of subscribe flag and price change time", this.susbcribeFlag, this.priceChangeTimer);
      
      
     //console.log("messageeeeeeeee",message);
     if(message!=null && message!=undefined){
        this.displayDetails(message);
        this.displayDetailsPriceChange(message);
     }
      
    });

    
  }

  //   ngOnDestroy() {
  //     console.log("unsubsscribing");
  //     this.aTimer.unsubscribe();
  //     this.tTimer.unsubscribe();
    
   
  // }

  ngOnDestroy() {
    
    // this.priceChangeTimer.unsubscribe();
    // console.log("unsubscribing");
      
    // console.log("destroying homepage");
  }



 
  displayDetails(value_) {

    this.watchlistDeletionHandleVariable=value_;
    this.loaderToAllData=true;
    //console.log('DATA CALLED FROM SERVER');
    

    this.homePageLoaderVariableGlobal = true;

    // if(this.priceChangeTimer){
    //   this.priceChangeTimer.unsubscribe();
    //   console.log("unsubscribing price change timer");
    // }
    // if(this.tTimer){
    //   this.tTimer.unsubscribe();
    //   console.log("unsubscribing time update timer");
    // }
    

    //const a=timer(0,60000);
    //this.priceChangeTimer.unsubscribe();
    //a.subscribe(x=>{
      this.service.getSearchDetails(value_).subscribe((data: any) => {
      //console.log("updating");
      console.log(value_);
      this.ticker = data['ticker'];
      // setting sell button visibility
      if (this.portfolioTickerArrayLocal.findIndex((element) => element == value_) != -1) {
        console.log("I am setting sell button")
        this.sellButtonVisible=true;
      }
      else{
        // console.log("I am of portfolio");
        this.sellButtonVisible=false;
      }
      //set up the watchlist star icon
      //if ticker is present in local storage set the corresponding ngif
      if((this.watchlistTickerArrayLocal.findIndex((element) => element == value_))!=-1){
        this.flagForWatchlistStarIcon=true;
      }
      //else if ticker is not present set the corresponding ngif
      else{
        this.flagForWatchlistStarIcon=false;
      }
      
      
      this.companyname = data['name'];
      this.exchange_ = data['exchange'];
      this.logourl = data['logo'];
      this.mainnnn=true;
      this.logoFlag = true;
      // this.loaderFlagImage=false;

      this.ipoStartDate = data['ipo'];

      this.sharedDataService.setAboutCompanySummaryTabipoStartDate(
        this.ipoStartDate
      );
      this.industry = data['finnhubIndustry'];
      this.sharedDataService.setAboutCompanySummaryTabIndustry(this.industry);
      this.webPage = data['weburl'];
      this.sharedDataService.setAboutCompanySummaryTabwebpage(this.webPage);
    });
   // })

  }

  watchListDeletionFunction(){
    if((this.watchlistTickerArrayLocal.findIndex((element) => element == this.watchlistDeletionHandleVariable))!=-1){
        this.flagForWatchlistStarIcon=true;
      }
      //else if ticker is not present set the corresponding ngif
      else{
        this.flagForWatchlistStarIcon=false;
      }
  }

  

  displayDetailsPriceChange(value_priceChange) {
     
    if(this.priceChangeTimer){
      this.priceChangeTimer.unsubscribe();
      console.log("unsubscribing price change timer");
    }
    if(this.tTimer){
      this.tTimer.unsubscribe();
      console.log("unsubscribing time update timer");
    }

    this.tTimer=timer(0,15000).subscribe(x=>{
      this.currentLATime=Date.now();
      console.log("subscribing time update timer");
    })

    this.priceChangeTimer=timer(0,40000).subscribe(()=>{
    //console.log("fetching details timer")
    this.service
      .getStockDetailsPriceChange(value_priceChange)
      .subscribe((data: any) => {
        // console.log("price refereshed");
        this.lastPriceFlag=false;
        this.last_price = data['c'].toFixed(2);
        // console.log("last price setting flag true",this.last_price);
        this.lastPriceFlag=true;
        this.change = data['d'].toFixed(2);
        this.percent_change = data['dp'].toFixed(2);
        this.date_time = data['t'];
        this.highPrice = data['h'].toFixed(2);
        this.sharedDataService.setLatestPriceDetailsSummaryTabHighprice(
          this.highPrice
        );
        this.lowPrice = data['l'].toFixed(2);
        this.sharedDataService.setLatestPriceDetailsSummaryTabLowprice(
          this.lowPrice
        );
        this.openPrice = data['o'].toFixed(2);
        this.sharedDataService.setLatestPriceDetailsSummaryTabOpenprice(
          this.openPrice
        );
        this.prevClose = data['pc'].toFixed(2);
        this.sharedDataService.setLatestPriceDetailsSummaryTabPrevClose(
          this.prevClose
        );
        
       // console.log('sent high price', this.highPrice);
      //  console.log("is market open", this.isMarketOpen);
        this.priceChangeProcessing();
      });
    })
  }


  




  priceChangeProcessing() {
    ////color of price change
    if (this.percent_change > 0) {
      this.temp_color = 'green';
    } 
    else if(this.percent_change<0) {
      this.temp_color = 'red';
    }
    else{
      this.temp_color='black';
    }

    //carrotColor
    this.greenCarrotEnable = false;
    this.redCarrotEnable = false;

    if (this.percent_change > 0) {
      this.greenCarrotEnable = true;
    } else {
      this.redCarrotEnable = true;
    }

    //date processing
    var millisecondsPriceChange = this.date_time * 1000;
    this.currentLATime=Date.now();
    if(this.currentLATime-millisecondsPriceChange<300000){
      this.isMarketOpen=true;
    }
    else{
        this.isMarketOpen=false;
        if(this.priceChangeTimer){
          this.priceChangeTimer.unsubscribe();
          console.log("unsubscribing price change timer");
        }
        if(this.tTimer){
          this.tTimer.unsubscribe();
          console.log("unsubscribing time update timer");
        }
    }
    //send data over to shared data service 
    //this.isMarketOpen=true;
    this.sharedDataService.sendMarketOpenStatus(this.isMarketOpen);
  //  this.isMarketOpen=true;
    // console.log("value of market is true/false",this.isMarketOpen);

  
    var dateObj = new Date(millisecondsPriceChange);
    var hours = dateObj.getHours();
    var minutes = dateObj.getMinutes();
    var seconds = dateObj.getSeconds();
    var day = dateObj.toLocaleString('en-CA', { day: 'numeric' });
    var month = dateObj.toLocaleString('en-CA', { month: 'numeric' });
    var year = dateObj.toLocaleString('en-CA', { year: 'numeric' });
    //console.log("observing for news modal",dateObj.toLocaleString('en-CA', { month: 'long' }));
    
 
    
    if (parseInt(month) >= 1 && parseInt(month) <= 9) {
      month = '0' + month;
    }
    if (parseInt(day) >= 1 && parseInt(day) <= 9) {
      day = '0' + day;
    }
    if (hours >= 0 && hours <= 9) {
      var hoursString = '0' + hours;
    } else {
      var hoursString = '' + hours;
    }
    if (minutes >= 0 && minutes <= 9) {
      var minutesString = '0' + minutes;
    } else {
      var minutesString = '' + minutes;
    }
    if (seconds >= 0 && seconds <= 9) {
      var secondsString = '0' + seconds;
    } else {
      var secondsString = '' + seconds;
    }
    var fulldateTime =
      year +
      '-' +
      month +
      '-' +
      day +
      ' ' +
      hoursString +
      ':' +
      minutesString +
      ':' +
      secondsString;
  //  console.log('full date is', fulldateTime);
    this.date_time_converted = fulldateTime;
  //  console.log("**********",this.last_price);
    this.main_flag=true;
    this.loaderFlag=false;
    this.loaderFlagImage=false;
    //flag for second loader
    this.loaderToAllData=false; 
  }

  addToWatchlist() {
    this.watchlistTickerArrayLocal.push(this.ticker);
    localStorage.setItem('watchlistTickersHTMLStorage',JSON.stringify(this.watchlistTickerArrayLocal));

    this.watchlistCompanyNameArrayLocal.push(this.companyname);
    localStorage.setItem('watchlistCompanyNamesHTMLStorage',JSON.stringify(this.watchlistCompanyNameArrayLocal));
    
    //setting flag for watchlist star
    this.flagForWatchlistStarIcon=true;
    //setting alert for stock added in watchlist
    this.watchListAddedstaticAlertClosed=false;
    setTimeout(() => this.staticAlertWatchlistAddedId.close(), 4000);
  }

  removeFromWatchlist(){
    var indexWatchlist=this.watchlistTickerArrayLocal.findIndex((element) => element == this.ticker);
    this.watchlistTickerArrayLocal.splice(indexWatchlist,1);
    localStorage.setItem('watchlistTickersHTMLStorage',JSON.stringify(this.watchlistTickerArrayLocal));
    this.watchlistCompanyNameArrayLocal.splice(indexWatchlist,1);
    localStorage.setItem('watchlistCompanyNamesHTMLStorage',JSON.stringify(this.watchlistCompanyNameArrayLocal));
    //setting flag for watchlist star
    this.flagForWatchlistStarIcon=false;
    //setting alert for stock deletion from watchlist
    this.watchListRemovedstaticAlertClosed=false;
    setTimeout(() => this.staticAlertWatchlistRemovedId.close(), 4000);
      
  }

  openBuyStockModal(){
    (document.getElementById("buyButtonModal") as HTMLButtonElement).disabled = true;
    this.portfolioTickerArrayLocal = JSON.parse(localStorage.getItem('portfolioTickerHTMLStorage')) || [];
    this.portfolioCompanyNameArrayLocal=JSON.parse(localStorage.getItem('portfolioCompanyNameHTMLStorage')) || [];
    this.portfolioStockQuantArrayLocal = JSON.parse(localStorage.getItem('portfolioStockQuantHTMLStorage')) || [];
    this.portfolioTotalCostArrayLocal = JSON.parse(localStorage.getItem('portfolioTotalCostHTMLStorage')) || [];
    
    this.totalPriceStockToBuy=0;
    

    //jquery to handle autofocus on input 
    
    $('#buyModal').on('shown.bs.modal', function () {
      $('#buyQuantityInput').focus();
    })
    
    $('#buyModal').on('hidden.bs.modal', function () {
      $('#buyQuantityInput').val(0);
      
    })
   this.remainingWallet=JSON.parse(localStorage.getItem('WalletMoneyHTMLStorage')) || 25000.00;
  }

  openSellStockModal(){
    (document.getElementById("sellButtonModal") as HTMLButtonElement).disabled = true;
    this.totalMoneyWallet=JSON.parse(localStorage.getItem('WalletMoneyHTMLStorage'));
    this.portfolioTickerArrayLocal = JSON.parse(localStorage.getItem('portfolioTickerHTMLStorage')) || [];
    this.portfolioCompanyNameArrayLocal=JSON.parse(localStorage.getItem('portfolioCompanyNameHTMLStorage')) || [];
    this.portfolioStockQuantArrayLocal = JSON.parse(localStorage.getItem('portfolioStockQuantHTMLStorage')) || [];
    this.portfolioTotalCostArrayLocal = JSON.parse(localStorage.getItem('portfolioTotalCostHTMLStorage')) || [];
    this.totalPriceStockToSell=0;
    this.totalPriceStockToSellForHTML=this.totalPriceStockToSell.toFixed(2);

    $('#sellModal').on('shown.bs.modal', function () {
      $('#sellQuantityInput').focus();
    })
    
    $('#sellModal').on('hidden.bs.modal', function () {
      $('#sellQuantityInput').val(0);
      
    })
    this.remainingWallet=JSON.parse(localStorage.getItem('WalletMoneyHTMLStorage')) || 25000.00;
  }

  

  buyStock() {
    // document.getElementById("buyQuantityInput").focus();
    this.totalMoneyWallet=JSON.parse(localStorage.getItem('WalletMoneyHTMLStorage'));
    this.portfolioTickerArrayLocal = JSON.parse(localStorage.getItem('portfolioTickerHTMLStorage')) || [];
  this.portfolioCompanyNameArrayLocal=JSON.parse(localStorage.getItem('portfolioCompanyNameHTMLStorage')) || [];
  this.portfolioStockQuantArrayLocal = JSON.parse(localStorage.getItem('portfolioStockQuantHTMLStorage')) || [];
  this.portfolioTotalCostArrayLocal = JSON.parse(localStorage.getItem('portfolioTotalCostHTMLStorage')) || [];

    this.remainingWallet=this.totalMoneyWallet-this.totalPriceStockToBuy;
    // console.log("testing buy",this.totalPriceStockToBuy);
    this.remainingWallet=this.remainingWallet.toFixed(2);
    localStorage.setItem('WalletMoneyHTMLStorage',JSON.stringify(this.remainingWallet));
    this.totalMoneyWallet=JSON.parse(localStorage.getItem('WalletMoneyHTMLStorage'));
    

    var index;
    var quant=parseInt(this.stockQuantityToBuy);
    
    var currentprice=this.last_price;
    
    //if ticker is already present in local storage
    if (this.portfolioTickerArrayLocal.findIndex((element) => element == this.ticker) != -1) {
      index = this.portfolioTickerArrayLocal.findIndex( (element) => element == this.ticker);
      var newquant=this.portfolioStockQuantArrayLocal.at(index);
      newquant+=quant;
      //newquant=newquant.toFixed(2);

      this.portfolioStockQuantArrayLocal.splice(index,1,newquant);
      var totalCostprev=this.portfolioTotalCostArrayLocal.at(index);
      //totalCostprev=totalCostprev.toFixed(2);
      totalCostprev=(currentprice*quant)+totalCostprev;
      totalCostprev=Math.round((totalCostprev+Number.EPSILON)*100)/100;
     // totalCostprev=totalCostprev.toFixed(2);

      //totalCostprev=totalCostprev.toFixed(2);
      this.portfolioTotalCostArrayLocal.splice(index,1,totalCostprev);
      
      localStorage.setItem('portfolioTickerHTMLStorage',JSON.stringify(this.portfolioTickerArrayLocal));
      localStorage.setItem('portfolioStockQuantHTMLStorage',JSON.stringify(this.portfolioStockQuantArrayLocal));
      localStorage.setItem('portfolioTotalCostHTMLStorage',JSON.stringify(this.portfolioTotalCostArrayLocal));
    }
    //if ticker is not present in local storage 
    else {
      this.portfolioTickerArrayLocal.push(this.ticker);
      //index = this.portfolioTickerArrayLocal.findIndex((element) => element == this.ticker);
      this.portfolioCompanyNameArrayLocal.push(this.companyname)
      this.portfolioStockQuantArrayLocal.push(quant);
      var totalCostToPush=quant*currentprice;
      totalCostToPush=Math.round((totalCostToPush+Number.EPSILON)*100)/100;
      this.portfolioTotalCostArrayLocal.push(totalCostToPush);
      
      // console.log('pushed');
      localStorage.setItem('portfolioTickerHTMLStorage',JSON.stringify(this.portfolioTickerArrayLocal));
      localStorage.setItem('portfolioCompanyNameHTMLStorage',JSON.stringify(this.portfolioCompanyNameArrayLocal));
      localStorage.setItem('portfolioStockQuantHTMLStorage',JSON.stringify(this.portfolioStockQuantArrayLocal));
      localStorage.setItem('portfolioTotalCostHTMLStorage',JSON.stringify(this.portfolioTotalCostArrayLocal));
    }
    //setting alert for stock bought in portfolio
    this.stockBoughtstaticAlertClosed=false;
    setTimeout(() => this.staticAlertstockBoughtId.close(), 4000);
    //setting sell button visibility true
    this.sellButtonVisible=true;
 }

  sellStock(){
    this.totalMoneyWallet=JSON.parse(localStorage.getItem('WalletMoneyHTMLStorage'));
    this.portfolioTickerArrayLocal = JSON.parse(localStorage.getItem('portfolioTickerHTMLStorage')) || [];
    this.portfolioCompanyNameArrayLocal=JSON.parse(localStorage.getItem('portfolioCompanyNameHTMLStorage')) || [];
    this.portfolioStockQuantArrayLocal = JSON.parse(localStorage.getItem('portfolioStockQuantHTMLStorage')) || [];
    this.portfolioTotalCostArrayLocal = JSON.parse(localStorage.getItem('portfolioTotalCostHTMLStorage')) || [];
    var index;
    this.totalMoneyWallet=JSON.parse(localStorage.getItem('WalletMoneyHTMLStorage'));
     //console.log("print sell stock values");
     //console.log("1. total money wallet",this.totalMoneyWallet);
    var newQuantity=parseInt(this.stockQuantityToSell);
     //console.log("2. new quantiy",newQuantity);
    this.remainingWallet=parseFloat(this.totalMoneyWallet)+parseFloat(this.totalPriceStockToSell);
    // console.log("3. total money wallet",this.totalMoneyWallet);
    // console.log("4.total price stock to sell",this.totalPriceStockToSell);
    // console.log("5. remaining wallet",this.remainingWallet);
    this.remainingWallet=this.remainingWallet.toFixed(2);

    localStorage.setItem('WalletMoneyHTMLStorage',JSON.stringify(this.remainingWallet));

    //if stock is already bought
    if(this.portfolioTickerArrayLocal.findIndex((element)=>element==this.ticker)!=-1){
      index=this.portfolioTickerArrayLocal.findIndex((element)=>element==this.ticker);
      //if quantity to sell is less than stock quantity available
      if(newQuantity<=this.portfolioStockQuantArrayLocal.at(index)){
          var oldQuantity=this.portfolioStockQuantArrayLocal.at(index);
          var modifiedQuantity=oldQuantity-newQuantity;

          //all stocks are sold delete the ticker, companyname, stockquant and total cost 
          if(modifiedQuantity==0){
            this.portfolioTickerArrayLocal.splice(index,1);
            this.portfolioCompanyNameArrayLocal.splice(index,1);
            this.portfolioStockQuantArrayLocal.splice(index,1);
            this.portfolioTotalCostArrayLocal.splice(index,1);
            localStorage.setItem('portfolioTickerHTMLStorage',JSON.stringify(this.portfolioTickerArrayLocal));
            localStorage.setItem('portfolioCompanyNameHTMLStorage',JSON.stringify(this.portfolioCompanyNameArrayLocal));
            localStorage.setItem('portfolioStockQuantHTMLStorage',JSON.stringify(this.portfolioStockQuantArrayLocal));
            localStorage.setItem('portfolioTotalCostHTMLStorage',JSON.stringify(this.portfolioTotalCostArrayLocal));
            this.sellButtonVisible=false;
          }
          else{
            var oldCost=this.portfolioTotalCostArrayLocal.at(index);
           //oldCost=oldCost.toFixed(2);
           //newQuantity=parseInt(newQuantity).toFixed(2);
          // newQuantity=parseInt(newQuantity.toFixed(2));
          // console.log("1. AJinkya");
          // console.log("1. new quantity",newQuantity);  
          // console.log("2. last price",this.last_price); 
          var newCost=newQuantity*this.last_price;
          newCost=Math.round((newCost+Number.EPSILON)*100)/100;
          // console.log("3. new cost",newCost);
          // console.log("4. old cost",oldCost);  
            
          var modifiedTotalCost=oldCost-newCost;
          modifiedTotalCost=Math.round((modifiedTotalCost+Number.EPSILON)*100)/100;
          //   console.log("5. modiffied totla cost",modifiedTotalCost); 
            // modifiedTotalCost=modifiedTotalCost.toFixed(2);
            // console.log("old cost, new quant, last price, new cost, modified cost",
            // oldCost,newQuantity,this.last_price,newCost,modifiedTotalCost);

            this.portfolioStockQuantArrayLocal.splice(index,1,modifiedQuantity);
            this.portfolioTotalCostArrayLocal.splice(index,1,modifiedTotalCost);

            localStorage.setItem('portfolioStockQuantHTMLStorage',JSON.stringify(this.portfolioStockQuantArrayLocal));
            localStorage.setItem('portfolioTotalCostHTMLStorage',JSON.stringify(this.portfolioTotalCostArrayLocal));
            this.sellButtonVisible=true;
          }

          
      }
    }
    //stock is not present already
    else{

    }
    //setting alert for stock sold in portfolio
    this.stockSoldstaticAlertClosed=false;
    setTimeout(() => this.staticAlertstockSoldId.close(), 4000);
  }


}
