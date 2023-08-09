import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { from } from 'rxjs';
import { createWatchCompilerHost } from 'typescript';
import { HomepageComponent } from './Components/homepage/homepage.component';
import { StockSearchFormComponent } from './Components/stock-search-form/stock-search-form.component';
import { HomepageNavbarComponent } from './Components/homepage-navbar/homepage-navbar.component';
import { WatchlistComponent } from './Components/watchlist/watchlist.component';
import { PortfolioComponent } from './Components/portfolio/portfolio.component';

const routes: Routes = [
  // { path: '', redirectTo:'search/home'},
  
  
 
  // { path:'search',
  //   component: StockSearchFormComponent,
  //   children:[
  //     {
  //       path:'home', component:StockSearchFormComponent
  //     },
  //     {
  //       path:':id', component:StockSearchFormComponent
  //     }
  //   ]
  
  // },
  
  { path: 'watchlist', component: WatchlistComponent },
  { path: 'portfolio', component: PortfolioComponent},
  { path: 'search/:id', component: StockSearchFormComponent},
  { path: 'search/home', component: StockSearchFormComponent},
  { path: '', redirectTo:'search/home', pathMatch:"full"},
  { path: '**', redirectTo:'search/home'},
  //april12220
  //hw8april3night
  //hw8april3final
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule],
})
export class AppRoutingModule {}
