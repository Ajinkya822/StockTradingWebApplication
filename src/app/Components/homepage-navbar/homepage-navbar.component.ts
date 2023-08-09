import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { SharedDataService } from 'src/app/service/shared-data.service';




@Component({
  selector: 'app-homepage-navbar',
  templateUrl: './homepage-navbar.component.html',
  styleUrls: ['./homepage-navbar.component.css'],
})
export class HomepageNavbarComponent implements OnInit {
  totalMoneyWallet:any;
  id:any;
  temp_:boolean;
  lastTickerSearched:any;
  isLastTickerSearchedHome=false;
  
  constructor(private router: Router,
    private sharedDataService: SharedDataService,
    private route: ActivatedRoute) {
      router.events.subscribe((val) => {
        // see also 
        // console.log("akshay",window.location.href);
        this.setNavigationBar(); 
    });
      
    }

  ngOnInit(): void {

    this.isLastTickerSearchedHome=false;

    this.totalMoneyWallet=JSON.parse(localStorage.getItem('WalletMoneyHTMLStorage')) || 25000;
    this.totalMoneyWallet=this.totalMoneyWallet.toFixed(2);
    localStorage.setItem('WalletMoneyHTMLStorage',JSON.stringify(this.totalMoneyWallet));
   // console.log("in nav bar",this.totalMoneyWallet)
  }

  setNavigationBar(){
    const url=window.location.href;
    var par = url.split('/');
    this.temp_=false;
    this.id=this.route.snapshot.params.id;
    // console.log("ajinkya", par);
    
    this.id=par[par.length-1];
    if(this.id!='home' && this.id!='watchlist' && this.id!='portfolio' && this.id!=''){
      this.lastTickerSearched=this.id;
    }
    if(this.id=='home'){
      this.temp_=false;
    }
    else if(this.id=='watchlist'){
      this.temp_=false;
    }
    else if(this.id=='portfolio'){
      this.temp_=false;
    }
    else if(this.id==''){
      this.temp_=false;
    }
    else{
      this.temp_=true;
      
    }
    // console.log("id and temp_ value for border",this.id, this.temp_);
  }
  
  navigateToWatchlist() {
    // console.log('navigating to watchlist');
    this.router.navigate(['watchlist']);
  }

  navigateToPortfolio() {
    // console.log('navigating to portfolio');
    this.router.navigate(['portfolio']);
  }

  navigateToHome(){
    this.router.navigate(['/search/home']);
    this.sharedDataService.setStockExistVariable(false);
  }

  

}
