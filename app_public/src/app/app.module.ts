import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './modules/app-routing/app-routing.module';
import { GoogleChartsModule } from 'angular-google-charts';
import { PaginationModule } from 'ngx-bootstrap/pagination';

import { CurrencyPipe } from './shared/pipes/currency.pipe';
import { SearchLettersPipe } from './shared/pipes/search-letters.pipe';
import { GrafpercentagePipe } from './shared/pipes/grafpercentage.pipe';
import { DatePipeTransform } from './shared/pipes/date.pipe';
import { PricedecimalPipe } from './shared/pipes/pricedecimal.pipe';

import { MainAppComponent } from './shared/components/main-app/main-app.component';
import { MESTmoviesComponent } from './shared/components/mestmovies/mestmovies.component';
import { GenreComponent } from './shared/components/genre/genre.component';
import { MoviesComponent } from './shared/components/movies/movies.component';
import { ManageDVDsComponent } from './shared/components/manage-dvds/manage-dvds.component';
import { AddMovieComponent } from './shared/components/add-movie/add-movie.component';
import { LoginComponent } from './shared/components/login/login.component';
import { RegisterComponent } from './shared/components/register/register.component';
import { ChangePasswordComponent } from './shared/components/change-password/change-password.component';
import { DvdsComponent } from './shared/components/dvds/dvds.component';
import { ShopingCartComponent } from './shared/components/shoping-cart/shoping-cart.component';
import { PaymentComponent } from './shared/components/payment/payment.component';
import { GraphComponent } from './shared/components/graph/graph.component';
import { HistoryComponent } from './shared/components/history/history.component';
import { SuccessfulTransactionComponent } from './shared/components/successful-transaction/successful-transaction.component';
import { UnsuccessfulTransactionComponent } from './shared/components/unsuccessful-transaction/unsuccessful-transaction.component';
import { DbComponent } from './shared/components/db/db.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

@NgModule({
  declarations: [
    MainAppComponent,
    MESTmoviesComponent,
    GenreComponent,
    MoviesComponent,
    ManageDVDsComponent,
    AddMovieComponent,
    LoginComponent,
    RegisterComponent,
    ChangePasswordComponent,
    DvdsComponent,
    ShopingCartComponent,
    GraphComponent,
    CurrencyPipe,
    HistoryComponent,
    PaymentComponent,
    SuccessfulTransactionComponent,
    UnsuccessfulTransactionComponent,
    DatePipeTransform,
    PricedecimalPipe,
    DbComponent,
    SearchLettersPipe,
    GrafpercentagePipe
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    AppRoutingModule,
    GoogleChartsModule,
    PaginationModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production, registrationStrategy: 'registerImmediately' })
  ],
  providers: [],
  bootstrap: [MainAppComponent]
})
export class AppModule { }
