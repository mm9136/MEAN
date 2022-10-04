import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule, Routes } from '@angular/router';

import { MESTmoviesComponent } from '../../shared/components/mestmovies/mestmovies.component';
import { GenreComponent } from '../../shared/components/genre/genre.component';
import { LoginComponent } from '../../shared/components/login/login.component';
import { MoviesComponent } from '../../shared/components/movies/movies.component';
import { ManageDVDsComponent } from '../../shared/components/manage-dvds/manage-dvds.component';
import { RegisterComponent } from '../../shared/components/register/register.component';
import { ChangePasswordComponent } from '../../shared/components/change-password/change-password.component';
import { DvdsComponent } from '../../shared/components/dvds/dvds.component';
import { ShopingCartComponent } from '../../shared/components/shoping-cart/shoping-cart.component';
import { GraphComponent } from '../../shared/components/graph/graph.component';
import { HistoryComponent } from '../../shared/components/history/history.component';
import { PaymentComponent } from '../../shared/components/payment/payment.component';
import { SuccessfulTransactionComponent } from '../../shared/components/successful-transaction/successful-transaction.component';
import { UnsuccessfulTransactionComponent } from '../../shared/components/unsuccessful-transaction/unsuccessful-transaction.component';
import { DbComponent } from '../../shared/components/db/db.component';


const paths: Routes = [
    {
      path: "",
      component: MESTmoviesComponent,
      runGuardsAndResolvers: 'always'
    },
    {
      path: "genres",
      component: GenreComponent
    },
    {
      path: "movies",
      component: MoviesComponent
    },
    {
      path: "managedvds",
      component: ManageDVDsComponent
    },
    {
      path: "login",
      component: LoginComponent
    },
    {
      path: "register",
      component: RegisterComponent
    },
    {
      path: "changePassword",
      component: ChangePasswordComponent
    },
    {
      path: "dvds",
      component: DvdsComponent
    },
    {
      path: "graph",
      component: GraphComponent
    },
    {
      path: "shoppingcart",
      component: ShopingCartComponent
    },
    {
      path: "payment",
      component: PaymentComponent
    },
{
      path: "history",
      component: HistoryComponent
    },
    {
      path: "successfultransaction/:order_id",
      component: SuccessfulTransactionComponent
    },
    {
      path: "unsuccessfultransaction",
      component: UnsuccessfulTransactionComponent
    },
    {
      path: "db",
      component: DbComponent
    }
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(paths)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
