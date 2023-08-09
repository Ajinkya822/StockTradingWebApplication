import { Component, OnInit } from '@angular/core';
import { GetdataService } from 'src/app/service/getdata.service';
import { SharedDataService } from 'src/app/service/shared-data.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { interval, timer } from 'rxjs';
import { ViewChild, ElementRef } from '@angular/core';
import {NgbAlert} from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.css']
})
export class PortfolioComponent implements OnInit {
  portfolioTickerArray:any;
  portfolioCompanyNameArray:any;
  portfolioStockQuantArray:any;
  portfolioTotalCostArray:any;
  portfolioAvgCostArray:any;
  portfolioCurrentPriceArray:any;
  portfolioMarketValueArray:any;
  portfolioChangeArray:any;
 // totalMoneyWallet:any;
  totalPriceStockToBuy:any;
  remainingWallet:any;
  totalPriceStockToSell:any;
  stockQuantityToBuy:any;
  globalVarToHandleStockIndex:any;
  stockQuantityToSell:any;
  globalCurrentPrice:any;
  warningStockAmountExceeded=false;
  warningStockToSellNotAvailable=false;
  portfolioEmpty=false;
  portfolioTimer:any;
  portfolioSubscription:Subscription;
  buyModalTimer:any;
  sellModalTimer:any;
  stockBoughtstaticAlertClosed=true;
  stockSoldstaticAlertClosed=true;
  stockTickerBought:any;
  stockTickerSold:any;
  tickerArray:any;
  isMarketOpen:boolean;
  priceChange_color:any;
  greenCarrotEnable: boolean[];
  redCarrotEnable: boolean[];
  activeStockToHandleSellButton:any;


  flag:boolean;

  @ViewChild('staticAlertstockBoughtId', {static: false}) staticAlertstockBoughtId: NgbAlert; 
  @ViewChild('staticAlertstockSoldId', {static: false}) staticAlertstockSoldId: NgbAlert; 

  onStockQuantChangeBuy(event: any) { 
      this.portfolioTickerArrayLocal = JSON.parse(localStorage.getItem('portfolioTickerHTMLStorage')) || [];
      this.portfolioStockQuantArrayLocal = JSON.parse(localStorage.getItem('portfolioStockQuantHTMLStorage')) || [];
      this.portfolioTotalCostArrayLocal = JSON.parse(localStorage.getItem('portfolioTotalCostHTMLStorage')) || [];
      this.totalMoneyWallet=JSON.parse(localStorage.getItem('WalletMoneyHTMLStorage'));
      this.stockQuantityToBuy = event.target.value;
      this.totalPriceStockToBuy=this.stockQuantityToBuy*this.globalCurrentPrice;
      this.totalPriceStockToBuy=Math.round((this.totalPriceStockToBuy+Number.EPSILON)*100)/100;
      this.totalPriceStockToBuy=this.totalPriceStockToBuy.toFixed(2);
      this.totalMoneyWallet=JSON.parse(localStorage.getItem('WalletMoneyHTMLStorage'));
      
      var currentTicker=this.portfolioTickerArray[this.globalVarToHandleStockIndex];
    
    if(this.totalPriceStockToBuy<=0){
      (document.getElementById("buyButtonModalPortfolio") as HTMLButtonElement).disabled = true;
    }
    else if(this.totalMoneyWallet-this.totalPriceStockToBuy<0){
      this.warningStockAmountExceeded=true;
      //document.getElementById("buyButton").disabled = true;
      (document.getElementById("buyButtonModalPortfolio") as HTMLButtonElement).disabled = true;
    }
    else{
      this.warningStockAmountExceeded=false;
      //document.getElementById("buyButton").disabled = true;
      (document.getElementById("buyButtonModalPortfolio") as HTMLButtonElement).disabled = false;
    }
  }
  
  onStockQuantChangeSell(event:any){
    this.portfolioTickerArrayLocal = JSON.parse(localStorage.getItem('portfolioTickerHTMLStorage')) || [];
    this.portfolioStockQuantArrayLocal = JSON.parse(localStorage.getItem('portfolioStockQuantHTMLStorage')) || [];
    this.portfolioTotalCostArrayLocal = JSON.parse(localStorage.getItem('portfolioTotalCostHTMLStorage')) || [];
    this.totalMoneyWallet=JSON.parse(localStorage.getItem('WalletMoneyHTMLStorage'));
    
    
    this.stockQuantityToSell=event.target.value;
    this.totalPriceStockToSell=this.stockQuantityToSell*this.globalCurrentPrice;
    this.totalPriceStockToSell=Math.round((this.totalPriceStockToSell+Number.EPSILON)*100)/100;
    this.totalPriceStockToSell=this.totalPriceStockToSell.toFixed(2);

    //get current ticker
    var currentTicker=this.portfolioTickerArray[this.globalVarToHandleStockIndex];
    //if stock quantity present
    if(this.portfolioTickerArrayLocal.findIndex((element)=>element==currentTicker)!=-1) {
      var indexStockToSell=this.portfolioTickerArrayLocal.findIndex((element)=>element==currentTicker);
        // if stock quantity to sell is greater than exisiting
      if(this.stockQuantityToSell>this.portfolioStockQuantArrayLocal.at(indexStockToSell)){
        this.warningStockToSellNotAvailable=true;
        (document.getElementById("sellButtonModalPortfolio") as HTMLButtonElement).disabled = true;
      }
        // stocks to sell are available
      else{
        this.warningStockToSellNotAvailable=false;
        (document.getElementById("sellButtonModalPortfolio") as HTMLButtonElement).disabled = false;
      }
      
    }
    // stock quantity is not present
    else{
      this.warningStockToSellNotAvailable=true;
      (document.getElementById("sellButtonModalPortfolio") as HTMLButtonElement).disabled = true;
    }

    if(this.totalPriceStockToSell<=0){
      (document.getElementById("sellButtonModalPortfolio") as HTMLButtonElement).disabled = true;
    }
  }

  portfolioTickerArrayLocal = JSON.parse(localStorage.getItem('portfolioTickerHTMLStorage')) || [];
  portfolioStockQuantArrayLocal = JSON.parse(localStorage.getItem('portfolioStockQuantHTMLStorage')) || [];
  portfolioTotalCostArrayLocal = JSON.parse(localStorage.getItem('portfolioTotalCostHTMLStorage')) || [];
  totalMoneyWallet=JSON.parse(localStorage.getItem('WalletMoneyHTMLStorage'));
  
  constructor(private service: GetdataService, private sharedDataService: SharedDataService, private router: Router) { }

  ngOnInit(): void {
    this.greenCarrotEnable = [false];
    this.redCarrotEnable = [false];
    this.sharedDataService.stockSearchSymbol$.subscribe((data: any) => {
      this.activeStockToHandleSellButton=data;
    });
    
    console.log("init portfolio");
    this.sharedDataService.toCheckIfMarketIsOpen$.subscribe((data:boolean)=>{
      console.log("Reading market status in portfolio",data);
      this.isMarketOpen=data;
    })
    if(this.isMarketOpen){
      console.log("market is open");
    }
    else{
      console.log("Market is closed");
    }

    this.warningStockAmountExceeded=false;
    this.warningStockToSellNotAvailable=false;
    this.fetchPortfolioDetails();
  }

  ngOnDestroy():void{
    
    if(this.portfolioTimer){
      this.portfolioTimer.unsubscribe();
      
    }

    
    if(this.buyModalTimer){
      this.buyModalTimer.unsubscribe();
    }
    
    if(this.sellModalTimer){
      this.sellModalTimer.unsubscribe();
    }
  }

  fetchPortfolioDetails(){
    
    this.flag=false;
    this.tickerArray = JSON.parse(localStorage.getItem('portfolioTickerHTMLStorage'));
    var companyNameArray=JSON.parse(localStorage.getItem('portfolioCompanyNameHTMLStorage'));
    var stockQuantArray = JSON.parse(localStorage.getItem('portfolioStockQuantHTMLStorage'));
    var totalCostArray = JSON.parse(localStorage.getItem('portfolioTotalCostHTMLStorage'));
    this.totalMoneyWallet=JSON.parse(localStorage.getItem('WalletMoneyHTMLStorage'));

    if(!this.tickerArray || this.tickerArray.length==0){
      this.portfolioEmpty=true;
    }
    else{
      this.portfolioEmpty=false;
    }
    
    this.portfolioTickerArray=[];
    this.portfolioCompanyNameArray=[];
    this.portfolioStockQuantArray=[];
    this.portfolioTotalCostArray=[];
    this.portfolioAvgCostArray=[];
    this.portfolioCurrentPriceArray=[];
    this.portfolioMarketValueArray=[];
    this.portfolioChangeArray=[];
    this.priceChange_color=[];

    //if added to handle if localstorage is empty initially
    if(this.tickerArray){
      this.portfolioTimer=timer(0,60000).subscribe(()=>{
        console.log("Subscribing portfolio");
        this.tickerArray = JSON.parse(localStorage.getItem('portfolioTickerHTMLStorage'));
        var companyNameArray=JSON.parse(localStorage.getItem('portfolioCompanyNameHTMLStorage'));
        var stockQuantArray = JSON.parse(localStorage.getItem('portfolioStockQuantHTMLStorage'));
        var totalCostArray = JSON.parse(localStorage.getItem('portfolioTotalCostHTMLStorage'));
        this.totalMoneyWallet=JSON.parse(localStorage.getItem('WalletMoneyHTMLStorage'));

        if(!this.isMarketOpen){
          if(this.portfolioTimer){
            this.portfolioTimer.unsubscribe();
            console.log("unSubscribing portfolio");
          }
        }
        
      console.log("ticker array length", this.tickerArray.length);
      if(this.tickerArray.length==0){
        if(this.portfolioTimer){
          this.portfolioTimer.unsubscribe();
        }
      }
      for(let i = 0; i < this.tickerArray.length; i++) {
        this.service.getStockDetailsPriceChange(this.tickerArray[i]).subscribe((data: any) => {
        this.portfolioCurrentPriceArray[i] = data['c'];
        this.fetchPortfolioDetails_2();
        // console.log("checking portfolio",this.portfolioCurrentPriceArray);
        });

      this.portfolioTickerArray[i]=this.tickerArray[i];
      this.portfolioCompanyNameArray[i]=companyNameArray[i];
      this.portfolioStockQuantArray[i]=stockQuantArray[i];
      this.portfolioStockQuantArray[i]=this.portfolioStockQuantArray[i];
      this.portfolioTotalCostArray[i]=totalCostArray[i];
      this.portfolioTotalCostArray[i]=this.portfolioTotalCostArray[i].toFixed(2);
      this.portfolioAvgCostArray[i]=(this.portfolioTotalCostArray[i])/(this.portfolioStockQuantArray[i]);
      this.portfolioAvgCostArray[i]=this.portfolioAvgCostArray[i].toFixed(2);
      
     }
    })
      

    }
    else{
      this.flag=true;
    }
    
  }

  fetchPortfolioDetails_2(){
    var tickerArray = JSON.parse(localStorage.getItem('portfolioTickerHTMLStorage')); 
    this.portfolioMarketValueArray=[];
    this.portfolioChangeArray=[];
    for(let i = 0; i < tickerArray.length; i++){
      this.portfolioMarketValueArray[i]=this.portfolioCurrentPriceArray[i]*this.portfolioStockQuantArray[i];
      this.portfolioMarketValueArray[i]=this.portfolioMarketValueArray[i].toFixed(2);
      this.portfolioChangeArray[i]=this.portfolioAvgCostArray[i]-this.portfolioCurrentPriceArray[i];
      this.portfolioChangeArray[i]=this.portfolioChangeArray[i].toFixed(2);
      if(this.portfolioChangeArray[i]>0){
        this.priceChange_color[i] = "green";
        this.greenCarrotEnable[i]=true;
      }
      else if(this.portfolioChangeArray[i]<0){
        this.priceChange_color[i] = "red";
        this.redCarrotEnable[i]=true;
      }
      else{
        this.priceChange_color[i] = "black";
        this.greenCarrotEnable[i]=false;
        this.redCarrotEnable[i]=false;
      }
      
     }
     this.flag=true;
  }

  openBuyStockModal(i){
    (document.getElementById("buyButtonModalPortfolio") as HTMLButtonElement).disabled = true;
    this.portfolioTickerArrayLocal = JSON.parse(localStorage.getItem('portfolioTickerHTMLStorage')) || [];
    this.portfolioStockQuantArrayLocal = JSON.parse(localStorage.getItem('portfolioStockQuantHTMLStorage')) || [];
    this.portfolioTotalCostArrayLocal = JSON.parse(localStorage.getItem('portfolioTotalCostHTMLStorage')) || [];
    this.totalMoneyWallet=JSON.parse(localStorage.getItem('WalletMoneyHTMLStorage'));
    
    this.totalPriceStockToBuy=0;
    
    this.globalVarToHandleStockIndex=i;
    this.buyModalTimer=timer(0,6000).subscribe(()=>{
      this.globalCurrentPrice=this.portfolioCurrentPriceArray[i];
      console.log("Subscribing buymodal");
      if(!this.isMarketOpen){
        if(this.buyModalTimer){
          this.buyModalTimer.unsubscribe();
          console.log("unSubscribing buymodal");
        }
      }
    }) 
    //jquery to handle autofocus on input
    //console.log("index is",i);
    $('#buyModal').on('shown.bs.modal', function () {
      $('#buyQuantityInput').focus();
    })
    
    $('#buyModal').on('hidden.bs.modal', function () {
      $('#buyQuantityInput').val(0);
      
    })
   this.remainingWallet=JSON.parse(localStorage.getItem('WalletMoneyHTMLStorage')) || 25000;
  }

  openSellStockModal(i){
    (document.getElementById("sellButtonModalPortfolio") as HTMLButtonElement).disabled = true;
    this.portfolioTickerArrayLocal = JSON.parse(localStorage.getItem('portfolioTickerHTMLStorage')) || [];
    this.portfolioStockQuantArrayLocal = JSON.parse(localStorage.getItem('portfolioStockQuantHTMLStorage')) || [];
    this.portfolioTotalCostArrayLocal = JSON.parse(localStorage.getItem('portfolioTotalCostHTMLStorage')) || [];
    this.totalMoneyWallet=JSON.parse(localStorage.getItem('WalletMoneyHTMLStorage'));
    
    this.totalPriceStockToSell=0;
    this.globalVarToHandleStockIndex=i; 
    this.sellModalTimer=timer(0,6000).subscribe(()=>{
      console.log("Subscribing sellmodal");
      this.globalCurrentPrice=this.portfolioCurrentPriceArray[i];
      if(!this.isMarketOpen){
        if(this.sellModalTimer){
          this.sellModalTimer.unsubscribe();
          console.log("unSubscribing sellmodal");
        }
      }
    })
    
    // console.log("index is",i);
    $('#sellModal').on('shown.bs.modal', function () {
      $('#sellQuantityInput').focus();
    })
    
    $('#sellModal').on('hidden.bs.modal', function () {
      $('#sellQuantityInput').val(0);
      
    })
    this.remainingWallet=JSON.parse(localStorage.getItem('WalletMoneyHTMLStorage')) || 25000;
  }

  buyStock() {
    this.portfolioTickerArrayLocal = JSON.parse(localStorage.getItem('portfolioTickerHTMLStorage')) || [];
    this.portfolioStockQuantArrayLocal = JSON.parse(localStorage.getItem('portfolioStockQuantHTMLStorage')) || [];
    this.portfolioTotalCostArrayLocal = JSON.parse(localStorage.getItem('portfolioTotalCostHTMLStorage')) || [];
    this.totalMoneyWallet=JSON.parse(localStorage.getItem('WalletMoneyHTMLStorage'));
    
    // document.getElementById("buyQuantityInput").focus();
  //  this.totalMoneyWallet=JSON.parse(localStorage.getItem('WalletMoneyHTMLStorage'));
    // console.log("total money",this.totalMoneyWallet);

    this.remainingWallet=this.totalMoneyWallet-this.totalPriceStockToBuy;
    this.remainingWallet=this.remainingWallet.toFixed(2);
    localStorage.setItem('WalletMoneyHTMLStorage',JSON.stringify(this.remainingWallet));
    this.totalMoneyWallet=JSON.parse(localStorage.getItem('WalletMoneyHTMLStorage'));

    var index;
    var current_ticker=this.portfolioTickerArray[this.globalVarToHandleStockIndex];
    var quant=parseInt(this.stockQuantityToBuy);
    //var currentprice=this.last_price;
    this.globalCurrentPrice=this.portfolioCurrentPriceArray[this.globalVarToHandleStockIndex];
    //if ticker is already present in local storage
    if (this.portfolioTickerArrayLocal.findIndex((element) => element == current_ticker) != -1) {
      index = this.portfolioTickerArrayLocal.findIndex( (element) => element == current_ticker);
      var newquant=this.portfolioStockQuantArrayLocal.at(index);
      newquant+=quant;
      this.stockTickerBought=this.portfolioTickerArrayLocal[index];
      //newquant=newquant.toFixed(2);
      this.portfolioStockQuantArrayLocal.splice(index,1,newquant);
      var totalCostprev=this.portfolioTotalCostArrayLocal.at(index);
      
      var pushTotalcostAfterBuy=this.globalCurrentPrice*quant;
      pushTotalcostAfterBuy=Math.round((pushTotalcostAfterBuy+Number.EPSILON)*100)/100;
      
      totalCostprev=(pushTotalcostAfterBuy)+totalCostprev;
      
      this.portfolioTotalCostArrayLocal.splice(index,1,totalCostprev);
      
      localStorage.setItem('portfolioTickerHTMLStorage',JSON.stringify(this.portfolioTickerArrayLocal));
      localStorage.setItem('portfolioStockQuantHTMLStorage',JSON.stringify(this.portfolioStockQuantArrayLocal));
      localStorage.setItem('portfolioTotalCostHTMLStorage',JSON.stringify(this.portfolioTotalCostArrayLocal));
      //setting remaining money after buy without refresh
      
      this.totalMoneyWallet=JSON.parse(localStorage.getItem('WalletMoneyHTMLStorage'));
      //setting updated stock quant after buy without refresh
      var stockQuantArray_ = JSON.parse(localStorage.getItem('portfolioStockQuantHTMLStorage'));
      this.portfolioStockQuantArray[index]=stockQuantArray_[index];
     // this.portfolioStockQuantArray[index]=this.portfolioStockQuantArray[index].toFixed(2);
      //setting total cost per share after buy
      var stockTotalcostArray_=JSON.parse(localStorage.getItem('portfolioTotalCostHTMLStorage'));
      this.portfolioTotalCostArray[index]=stockTotalcostArray_[index];
      this.portfolioTotalCostArray[index]=this.portfolioTotalCostArray[index].toFixed(2);
      //setting avg cost per share after buy
      this.portfolioAvgCostArray[index]=(this.portfolioTotalCostArray[index])/(this.portfolioStockQuantArray[index]);
      this.portfolioAvgCostArray[index]=this.portfolioAvgCostArray[index].toFixed(2);
      //setting market value after buy
      this.portfolioMarketValueArray[index]=this.portfolioCurrentPriceArray[index]*this.portfolioStockQuantArray[index];
      this.portfolioMarketValueArray[index]=this.portfolioMarketValueArray[index].toFixed(2);
      //setting change value after buy
      this.portfolioChangeArray[index]=this.portfolioAvgCostArray[index]-this.portfolioCurrentPriceArray[index];
      this.portfolioChangeArray[index]=this.portfolioChangeArray[index].toFixed(2);
      if(this.portfolioChangeArray[index]>0){
        this.priceChange_color[index] = "green";
        this.greenCarrotEnable[index]=true;
      }
      else if(this.portfolioChangeArray[index]<0){
        this.priceChange_color[index] = "red";
        this.redCarrotEnable[index]=true;
      }
      else{
        this.priceChange_color[index] = "black";
        this.greenCarrotEnable[index]=false;
        this.redCarrotEnable[index]=false;
      }


    }
    //if ticker is not present in local storage 
    // else {
    //   this.portfolioTickerArrayLocal.push(this.ticker);
    //   //index = this.portfolioTickerArrayLocal.findIndex((element) => element == this.ticker);
    //   this.portfolioCompanyNameArrayLocal.push(this.companyname)
    //     this.portfolioStockQuantArrayLocal.push(quant);
    //   this.portfolioTotalCostArrayLocal.push(quant*currentprice);
    //   console.log('pushed');
    //   localStorage.setItem('portfolioTickerHTMLStorage',JSON.stringify(this.portfolioTickerArrayLocal));
    //   localStorage.setItem('portfolioCompanyNameHTMLStorage',JSON.stringify(this.portfolioCompanyNameArrayLocal));
    //   localStorage.setItem('portfolioStockQuantHTMLStorage',JSON.stringify(this.portfolioStockQuantArrayLocal));
    //   localStorage.setItem('portfolioTotalCostHTMLStorage',JSON.stringify(this.portfolioTotalCostArrayLocal));
    // }
    //setting alert for stock bought in portfolio
    this.stockBoughtstaticAlertClosed=false;
    setTimeout(() => this.staticAlertstockBoughtId.close(), 4000);
   // window.location.reload();
 }

  sellStock(){
    this.portfolioTickerArrayLocal = JSON.parse(localStorage.getItem('portfolioTickerHTMLStorage')) || [];
    this.portfolioStockQuantArrayLocal = JSON.parse(localStorage.getItem('portfolioStockQuantHTMLStorage')) || [];
    this.portfolioTotalCostArrayLocal = JSON.parse(localStorage.getItem('portfolioTotalCostHTMLStorage')) || [];
    this.totalMoneyWallet=JSON.parse(localStorage.getItem('WalletMoneyHTMLStorage'));
    
    var index;
    var current_ticker=this.portfolioTickerArray[this.globalVarToHandleStockIndex];
    this.globalCurrentPrice=this.portfolioCurrentPriceArray[this.globalVarToHandleStockIndex];
    this.totalMoneyWallet=JSON.parse(localStorage.getItem('WalletMoneyHTMLStorage'));
    var newQuantity=parseInt(this.stockQuantityToSell);
    this.remainingWallet=parseInt(this.totalMoneyWallet)+parseInt(this.totalPriceStockToSell);
    this.remainingWallet=this.remainingWallet.toFixed(2);
    localStorage.setItem('WalletMoneyHTMLStorage',JSON.stringify(this.remainingWallet));

    //if stock is already bought
    if(this.portfolioTickerArrayLocal.findIndex((element)=>element==current_ticker)!=-1){
      index=this.portfolioTickerArrayLocal.findIndex((element)=>element==current_ticker);
      this.stockTickerSold=this.portfolioTickerArrayLocal[index];
      console.log("this stock is getting sold", this.stockTickerSold);
      //if quantity to sell is less than stock quantity available
      if(newQuantity<=this.portfolioStockQuantArrayLocal.at(index)){
          var oldQuantity=this.portfolioStockQuantArrayLocal.at(index);
          var modifiedQuantity=oldQuantity-newQuantity;
          if(modifiedQuantity==0){
            this.portfolioTickerArrayLocal.splice(index,1);
            this.portfolioCompanyNameArray.splice(index,1);
            this.portfolioStockQuantArrayLocal.splice(index,1);
            this.portfolioTotalCostArrayLocal.splice(index,1);
            localStorage.setItem('portfolioTickerHTMLStorage',JSON.stringify(this.portfolioTickerArrayLocal));
            localStorage.setItem('portfolioCompanyNameHTMLStorage',JSON.stringify(this.portfolioCompanyNameArray));
            localStorage.setItem('portfolioStockQuantHTMLStorage',JSON.stringify(this.portfolioStockQuantArrayLocal));
            localStorage.setItem('portfolioTotalCostHTMLStorage',JSON.stringify(this.portfolioTotalCostArrayLocal));
            
            //setting remaining money after buy without refresh
            this.totalMoneyWallet=JSON.parse(localStorage.getItem('WalletMoneyHTMLStorage'));
            // console.log(this.portfolioTickerArray);
            //experiment
            var tickerArray_ = JSON.parse(localStorage.getItem('portfolioTickerHTMLStorage'));
            var companyNameArray_=JSON.parse(localStorage.getItem('portfolioCompanyNameHTMLStorage'));
            var stockQuantArray_ = JSON.parse(localStorage.getItem('portfolioStockQuantHTMLStorage'));
            var totalCostArray_ = JSON.parse(localStorage.getItem('portfolioTotalCostHTMLStorage'));
            // console.log(tickerArray_);
            this.portfolioTickerArray = tickerArray_;
            // for(let i = 0; i < tickerArray_.length; i++){
            //   // this.portfolioTickerArray[i]=tickerArray_[i];
            //   this.portfolioCompanyNameArray[i]=companyNameArray_[i];
            //   this.portfolioStockQuantArray[i]=stockQuantArray_[i];
            //   this.portfolioStockQuantArray[i]=this.portfolioStockQuantArray[i].toFixed(2);
            //   this.portfolioTotalCostArray[i]=totalCostArray_[i];
            //   this.portfolioTotalCostArray[i]=this.portfolioTotalCostArray[i].toFixed(2);
            //   this.portfolioAvgCostArray[i]=(this.portfolioTotalCostArray[i])/(this.portfolioStockQuantArray[i]);
            //   this.portfolioAvgCostArray[i]=this.portfolioAvgCostArray[i].toFixed(2);
            if(this.activeStockToHandleSellButton==this.stockTickerSold){
              this.sharedDataService.sendInfoToDisableSellButton(true);
            }
              
              

            // }
            // console.log(this.portfolioTickerArray);
          }
          else{
            var oldCost=this.portfolioTotalCostArrayLocal.at(index);
            var newCost=newQuantity*this.globalCurrentPrice;
            var modifiedTotalCost=oldCost-newCost;
            
            this.portfolioStockQuantArrayLocal.splice(index,1,modifiedQuantity);
            this.portfolioTotalCostArrayLocal.splice(index,1,modifiedTotalCost);

            localStorage.setItem('portfolioStockQuantHTMLStorage',JSON.stringify(this.portfolioStockQuantArrayLocal));
            localStorage.setItem('portfolioTotalCostHTMLStorage',JSON.stringify(this.portfolioTotalCostArrayLocal));
            //setting remaining money after sell without refresh
            this.totalMoneyWallet=JSON.parse(localStorage.getItem('WalletMoneyHTMLStorage'));
            //setting updated stock quant after sell without refresh
            var stockQuantArray_ = JSON.parse(localStorage.getItem('portfolioStockQuantHTMLStorage'));
            this.portfolioStockQuantArray[index]=stockQuantArray_[index];
            this.portfolioStockQuantArray[index]=this.portfolioStockQuantArray[index].toFixed(2);
            //setting total cost per share after sell
            var stockTotalcostArray_=JSON.parse(localStorage.getItem('portfolioTotalCostHTMLStorage'));
            this.portfolioTotalCostArray[index]=stockTotalcostArray_[index];
            this.portfolioTotalCostArray[index]=this.portfolioTotalCostArray[index].toFixed(2);
            //setting avg cost per share after buy
            this.portfolioAvgCostArray[index]=(this.portfolioTotalCostArray[index])/(this.portfolioStockQuantArray[index]);
            this.portfolioAvgCostArray[index]=this.portfolioAvgCostArray[index].toFixed(2);
            //setting market value after buy
            this.portfolioMarketValueArray[index]=this.portfolioCurrentPriceArray[index]*this.portfolioStockQuantArray[index];
            this.portfolioMarketValueArray[index]=this.portfolioMarketValueArray[index].toFixed(2);
            //setting change value after buy
            this.portfolioChangeArray[index]=this.portfolioAvgCostArray[index]-this.portfolioCurrentPriceArray[index];
            this.portfolioChangeArray[index]=this.portfolioChangeArray[index].toFixed(2);
            if(this.portfolioChangeArray[index]>0){
              this.priceChange_color[index] = "green";
              this.greenCarrotEnable[index]=true;
            }
            else if(this.portfolioChangeArray[index]<0){
              this.priceChange_color[index] = "red";
              this.redCarrotEnable[index]=true;
            }
            else{
              this.priceChange_color[index] = "black";
              this.greenCarrotEnable[index]=false;
              this.redCarrotEnable[index]=false;
            }

          }
          
      }
      this.tickerArray = JSON.parse(localStorage.getItem('portfolioTickerHTMLStorage'));
      if(!this.tickerArray || this.tickerArray.length==0){
      this.portfolioEmpty=true;
    }
    }
    //stock is not present already
    else{

    }
    //setting alert for stock sold in portfolio
    this.stockSoldstaticAlertClosed=false;
    setTimeout(() => this.staticAlertstockSoldId.close(), 4000);
   // window.location.reload();
  }
  
}
