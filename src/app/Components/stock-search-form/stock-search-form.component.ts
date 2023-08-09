import { Component, ComponentFactoryResolver, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { GetdataService } from 'src/app/service/getdata.service';
import { SharedDataService } from 'src/app/service/shared-data.service';
import { NavigationEnd, Router } from '@angular/router';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { LoadingService } from 'src/app/service/loading.service';
import { debounceTime } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-stock-search-form',
  templateUrl: './stock-search-form.component.html',
  styleUrls: ['./stock-search-form.component.css'],
})
export class StockSearchFormComponent implements OnInit {
  count: any;
  ajinkya: any;
  ticker: any;
  companyname: any;
  exchange_: any;
  logourl: string;
  stock_symbols: any;
  temparray = [];
  temparray_1 = [];
  filteredOptions;
  formGroup: FormGroup;
  data_stringified: any;
  value_: any;
  validationTickerKey: any;
  stockExistGlobalVariable: boolean;
  loading$ = false;
  loaderVariableHomepage: any;
  id:any;
  checking=false;
  tickerInformEmpty=false;
  stockValidationAlert=false;

  constructor(
    private getDataservice: GetdataService,
    private fb: FormBuilder,
    private sharedDataService: SharedDataService,
    private router: Router,
    public loader: LoadingService,
    private route: ActivatedRoute

    ) {
      // console.log("cons");
    //   // override the route reuse strategy
    //  this.router.routeReuseStrategy.shouldReuseRoute = function(){
    //     return false;
    //  }

    //  this.router.events.subscribe((evt) => {
    //     if (evt instanceof NavigationEnd) {
    //        // trick the Router into believing it's last link wasn't previously loaded
    //        this.router.navigated = false;
    //        // if you need to scroll back to top, here is the right place
    //        window.scrollTo(0, 0);
    //     }
    // });

    this.route.params.subscribe((params) => {
      
      let stockTicker = params['id'];
     // console.log("stockticker is",stockTicker);
      if(stockTicker!=='home') {
        // this.formGroup.controls['stocktickersearch'].setValue(stockTicker.toUpperCase());
        this.sharedDataService.sendMessage(stockTicker.toUpperCase());
        this.stockSearchvalid(stockTicker);
      } else {
       // this.formGroup.controls['stocktickersearch'].setValue('');      
        this.router.navigate(['/search/home']);
        this.sharedDataService.setStockExistVariable(false);
      }
      
    })
      
      
  }

  

  ngOnInit(): void {
    console.log("ngonint");
    //subscribe to company peer data
    // this.sharedDataService.companyPeerDataToClick$.subscribe((data)=>{
    //   this.comingFromCompanyPeer(data);
    // })


    this.loader.loading$.subscribe((res) => this.loading$ = res);
    this.checking=false;
    this.initForm();
//     this.id=this.route.snapshot.params.id;
//     window.addEventListener('locationchange', function(){
//     // console.log('location changed!');
// })
//     // console.log("dynamic url",this.id);
//     if(this.id!='home'){
//       // console.log('Reading parameter from url');
//       //converting id to uppercase
//       var temp=this.id.toUpperCase();
//       this.formGroup.controls['stocktickersearch'].setValue(this.id.toUpperCase());
//       this.onSubmitUrl(this.id);
      
//     }
    
  }

  initForm() {
    this.formGroup = this.fb.group({
      stocktickersearch: [''],
    });

    //debounce added to wait for input before making another api call
    this.formGroup
      .get('stocktickersearch')
      .valueChanges.pipe(debounceTime(800)).subscribe((response) => {
        this.loaderVariableHomepage =
          document.getElementById('homepageFirstBar');
        // console.log(
        //   'loaderVariableHomepage value is',
        //   this.loaderVariableHomepage
        // );
        this.sharedDataService.setHomepageLoaderVariable(
          this.loaderVariableHomepage
        );
        this.checking=false;
        this.temparray = [];
        this.temparray_1 = [];

        this.getDetails(response);
      });
  }

  getDetails(_ticker_: string) {
    this.getDataservice.getStockDetails(_ticker_).subscribe((data2: any) => {
      this.temparray = [];
      this.temparray_1 = [];
      for (var i = 0; i < data2.length; i++) {
        this.temparray[i] = data2[i]['symbol'];
        this.temparray_1[i] = data2[i]['description'];
      }
      this.checking=true;
      // console.log("array after search",this.temparray);
    });
  }
  // onSubmitUrl(id){
  //   this.router.navigate(['/search/'+id]);

  //   this.sharedDataService.sendMessage(id);
    
  //   this.value_=this.id.toUpperCase();
    
  //   this.sharedDataService.sendMessage(this.value_);
  //   // console.log(
  //   //   'Step number 4: I am in on submit function, sending ticker value to stock search valid function, value is',
  //   //   this.value_
  //   // );
  //   this.stockSearchvalid(this.value_);
  // }

  onSubmit(event: MatAutocompleteSelectedEvent) {
    this.router.navigate(['/search/'+event.option.value]);
    //this.value_=this.id;

    console.log('sub value is', event.option.value);

    this.value_ = event.option.value;
    // console.log(
    //   'Step number 1: I am in on submit function, on submit form value of ticker is',
    //   this.value_
    // );
    // console.log(
    //   'Step number 2: I am in on submit function, sending ticker value to shared data service, value is',
    //   this.value_
    // );
    // this.sharedDataService.sendMessage(this.value_);
    // console.log(
    //   'Step number 4: I am in on submit function, sending ticker value to stock search valid function, value is',
    //   this.value_
    // );
    // this.stockSearchvalid(this.value_);
    
  }

  comingFromCompanyPeer(valueTicker:any){
      this.sharedDataService.sendMessage(valueTicker);
      this.stockSearchvalid(valueTicker);
  }

  stockSearchvalid(ticker: string) {
    this.getDataservice
      .stockSearchValidation(ticker)
      .subscribe((data3: any) => {
        this.validationTickerKey = data3['ticker'];
       // console.log('Validation key is', this.validationTickerKey);
        if (this.validationTickerKey != undefined && this.validationTickerKey != '' ) {
          this.stockValidationAlert=false;
          //console.log('Stock is valid', this.validationTickerKey);
          this.stockExistGlobalVariable = true;
        } else {
          this.stockValidationAlert=true;
          this.router.navigate(['/search/home']);
          this.sharedDataService.setStockExistVariable(false);
        //  console.log('Stock is not valid', this.validationTickerKey);
          this.stockExistGlobalVariable = false;
        }
        // console.log(
        //   'Step number 6: validation is complete value of stock exist variable is and sending this value on sharedDataService',
        //   this.stockExistGlobalVariable
        // );

        this.sharedDataService.setStockExistVariable(
          this.stockExistGlobalVariable
        );
      });
  }

  onSubmitTheForm(keytickerValueFromFrom){
   // console.log("from submitted value", keytickerValueFromFrom['stocktickersearch']);
   //console.log("submitted value from form",keytickerValueFromFrom['stocktickersearch']);
   
   if(keytickerValueFromFrom['stocktickersearch']==''){
     this.tickerInformEmpty=true;
     this.router.navigate(['/search/home']);
     this.sharedDataService.setStockExistVariable(false);
   } 
   else{
     this.tickerInformEmpty=false;;
   }
   this.router.navigate(['/search/'+keytickerValueFromFrom['stocktickersearch']]);
  }

  onClearTheForm(){
   // console.log("clearing the form");
    this.router.navigate(['/search/home']);
    this.sharedDataService.setStockExistVariable(false);
  }






}
