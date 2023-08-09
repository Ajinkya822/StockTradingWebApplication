import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HomepageComponent } from './Components/homepage/homepage.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomepageNavbarComponent } from './Components/homepage-navbar/homepage-navbar.component';
import { StockSearchFormComponent } from './Components/stock-search-form/stock-search-form.component';
import { FooterCComponent } from './Components/footer-c/footer-c.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { NetworkInterceptor } from './Interceptor/network.interceptor';
import { MatTabsModule } from '@angular/material/tabs';
import { AllTabsComponent } from './Components/all-tabs/all-tabs.component';
import { HighchartsChartModule } from 'highcharts-angular';
import { HistoricalChartsComponent } from './Components/historical-charts/historical-charts.component';
import { SampleChartComponent } from './Components/sample-chart/sample-chart.component';
import { RTrendsChartComponent } from './Components/r-trends-chart/r-trends-chart.component';
import { EarningChartComponent } from './Components/earning-chart/earning-chart.component';
import { WatchlistComponent } from './Components/watchlist/watchlist.component';
import { PortfolioComponent } from './Components/portfolio/portfolio.component';
import { RouteReuseStrategy } from '@angular/router';
import {CustomReuseStrategy} from './reuse-strategy';
import { HistoricalFirstTabComponent } from './Components/historical-first-tab/historical-first-tab.component';
import * as $ from 'jquery';


import {HashLocationStrategy, LocationStrategy, PathLocationStrategy} from '@angular/common';

@NgModule({
  declarations: [
    AppComponent,
    HomepageComponent,
    HomepageNavbarComponent,
    StockSearchFormComponent,
    FooterCComponent,
    AllTabsComponent,
    HistoricalChartsComponent,
    SampleChartComponent,
    RTrendsChartComponent,
    EarningChartComponent,
    WatchlistComponent,
    PortfolioComponent,
    HistoricalFirstTabComponent,
  
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatAutocompleteModule,
    FormsModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatTabsModule,
    HighchartsChartModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: NetworkInterceptor,
      multi: true,
    },
    {
      provide: RouteReuseStrategy,
      useClass: CustomReuseStrategy
    },
     {provide: LocationStrategy, useClass: HashLocationStrategy}
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
