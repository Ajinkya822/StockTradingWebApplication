import { Component, OnInit } from '@angular/core';
import { GetdataService } from 'src/app/service/getdata.service';
import { SharedDataService } from 'src/app/service/shared-data.service';
import { LoadingService } from 'src/app/service/loading.service';
import { Router,RouterModule } from '@angular/router';
import { ViewChild, ElementRef } from '@angular/core';
import {NgbAlert} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-watchlist',
  templateUrl: './watchlist.component.html',
  styleUrls: ['./watchlist.component.css'],
})
export class WatchlistComponent implements OnInit {
  watchListdata: any;
  watchListTickerArray: any;
  watchListCompanyNamesArray: any;
  watchListCurrentPriceArray: any;
  watchListPriceChangeArray: any;
  watchListPerecentChangeArray: any;
  watchListEmpty=false;
  priceChange_color:any;
  greenCarrotEnable: boolean[];
  redCarrotEnable: boolean[];
  count: any;
  finalFlag: boolean;
  watchListRemovedstaticAlertClosed=true;
  ticketToRemove:any;
  tickersArray = JSON.parse(localStorage.getItem('watchlistTickersHTMLStorage'));
  companyNamesArray = JSON.parse(localStorage.getItem('watchlistCompanyNamesHTMLStorage'));
  @ViewChild('staticAlertWatchlistRemovedId', {static: false}) staticAlertWatchlistRemovedId: NgbAlert;
  
  constructor(
    private service: GetdataService,
    private sharedDataService: SharedDataService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.greenCarrotEnable = [false];
    this.redCarrotEnable = [false];
    this.fetchWatchListDetails();

  }
  ngOnDestroy() {
    // console.log("destroying watchlist");
  }
  fetchWatchListDetails() {
    // var tickersArray = JSON.parse(localStorage.getItem('stockTickersLocal'));
    // var companyNamesArray = JSON.parse(localStorage.getItem('stockCompanyNameLocal'));
    //!tickerarray is added to handle when local storage is cleared
    if(!this.tickersArray || this.tickersArray.length==0){
      this.watchListEmpty=true;
    }
    else{
      this.watchListEmpty=false;
    }
    
    this.watchListTickerArray = [];
    this.watchListCompanyNamesArray = [];
    this.watchListCurrentPriceArray = [];
    this.watchListPriceChangeArray = [];
    this.watchListPerecentChangeArray = [];
    this.priceChange_color=[];

    //console.log('company names arary', companyNamesArray);
    if(this.tickersArray){
      for (let i = 0; i < this.tickersArray.length; i++) {
        //console.log(tickersArray[i]);
        this.service
        .getStockDetailsPriceChange(this.tickersArray[i])
        .subscribe((data: any) => {
          this.watchListTickerArray[i] = this.tickersArray[i];
          this.watchListCompanyNamesArray[i] = this.companyNamesArray[i];
          this.watchListCurrentPriceArray[i] = data['c'].toFixed(2);
          this.watchListPriceChangeArray[i] = data['d'].toFixed(2);
          this.watchListPerecentChangeArray[i] = data['dp'].toFixed(2);
          if (this.watchListPerecentChangeArray[i] >= 0) {
            this.priceChange_color[i] = "green";
            this.greenCarrotEnable[i]=true;
          } 
          else if(this.watchListPerecentChangeArray[i] < 0) {
            this.priceChange_color[i] = "red";
            this.redCarrotEnable[i]=true;
          }
          else{
            this.priceChange_color[i] = "black";
            this.greenCarrotEnable[i]=false;
            this.redCarrotEnable[i]=false;
          }
          //this.priceChangeProcessingWatchList();
        });
    }
    }

  }

  removeFromWatchlist(i){
    var indexWatchlist=this.tickersArray.findIndex((element) => element == this.watchListTickerArray[i]);
    this.ticketToRemove=this.tickersArray[indexWatchlist];
    this.tickersArray.splice(indexWatchlist,1);
    localStorage.setItem('watchlistTickersHTMLStorage',JSON.stringify(this.tickersArray));
    this.companyNamesArray.splice(indexWatchlist,1);
    localStorage.setItem('watchlistCompanyNamesHTMLStorage',JSON.stringify(this.companyNamesArray));
    this.watchListTickerArray=this.tickersArray;
    //console.log("hey I am deleting something from watchlist");
    this.sharedDataService.handleDeletionFromWatchlist("deleting from watchlist");
    // window.location.reload();
    if(!this.tickersArray || this.tickersArray.length==0){
      this.watchListEmpty=true;
    }
    this.watchListRemovedstaticAlertClosed=false;
    setTimeout(() => this.staticAlertWatchlistRemovedId.close(), 4000);
  }

  navigateToStockFromWatchlist(tickerToNavigate){
    // console.log("watchlist navigation",tickerToNavigate);
   // window.location.href='http://localhost:4200/#/search/'+tickerToNavigate+'';
   // this.router.navigate(['/search',tickerToNavigate]);
    this.sharedDataService.setCompanyPeerDataToClick(tickerToNavigate);
    this.router.navigate(['/search',tickerToNavigate]);
  }

  
}
