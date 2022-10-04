import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import { DvdService } from '../../services/dvd.service';

import {UrlhistoryService} from "../../services/urlhistory.service";
import { Dvd } from '../../classes/dvd';
import { DvdMovie } from '../../classes/dvd-movie';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-shoping-cart',
  templateUrl: './shoping-cart.component.html',
  styleUrls: ['./shoping-cart.component.css']
})
export class ShopingCartComponent implements OnInit {
  public dvds: Dvd[] = [];
  public total = 0;
  public empty = true;
  constructor(private authService : AuthService, private dvdService: DvdService,  private router : Router, private urlHistoryService: UrlhistoryService) {
    this.reset()
  }

  ngOnInit(): void {
    if(this.authService.jePrijavljen()) {
      if(localStorage.getItem("cart")) {
        this.reloadCart();
      }
    }else{
      this.router.navigateByUrl(this.urlHistoryService.vrniPredhodnjeUrlNaslove());
    }


  }
  reset():void {
    this.dvds = this.dvds.slice();

  }

  reloadCart(): void{
    this.dvds = [];
    this.total = 0;
    var cart =  JSON.parse(localStorage.getItem("cart"));
    var totalPrice = 0;
    if(typeof cart != "undefined") for(var i = 0; i<cart.length; i++) {
      this.dvdService.getDvdById(cart[i].dvd_id).then(dvd => {
          var cart =  JSON.parse(localStorage.getItem("cart"));
          for(var i = 0; i<cart.length; i++) {
              if(cart[i].dvd_id == dvd._id){
                dvd.quantity = cart[i].quantity;
               dvd.price = cart[i].quantity * dvd.price;
                this.total += dvd.price;
              }

          }
        this.dvds.push(dvd);
          this.empty = false;
          this.reset();
      }).catch(error => {});

    }
  }
  removeFromCart(dvd_id) : void{
    var cart =   JSON.parse(localStorage.getItem("cart"));
    var cartNew = [];
    for(var i=0; i<cart.length; i++){
      if(cart[i].dvd_id != dvd_id){
        cartNew.push(cart[i]);
      }else{
        this.dvdService.updateQuantity(cart[i].dvd_id, cart[i].quantity, "1").then(data =>
        {
          console.log(data);
        });

      }
    }
    localStorage.setItem("cart",JSON.stringify(cartNew));
    this.reloadCart();
  }

   minus(dvd_id) : void{
    var cart =   JSON.parse(localStorage.getItem("cart"));

    for(var i=0; i<cart.length; i++){
      if(cart[i].dvd_id == dvd_id){
        if(cart[i].quantity > 1)
          cart[i].quantity--;
        this.dvdService.updateQuantity(cart[i].dvd_id, "1", "1").then(data =>
        {
          console.log(data);
        });
      }
    }
    localStorage.setItem("cart",JSON.stringify(cart));
    this.reloadCart()
  }


  plus(dvd_id) : void {
    var cart = JSON.parse(localStorage.getItem("cart"));

    for (var i = 0; i < cart.length; i++) {
      if (cart[i].dvd_id == dvd_id) {
        cart[i].quantity++;

        var a = this.dvdService.updateQuantity(cart[i].dvd_id, "1", "0").then(data => {
        }).catch(error => {
          alert("There is no enough DVDs!");
          for (var i = 0; i < cart.length; i++) {
            cart[i].quantity--;
          }
          localStorage.setItem("cart", JSON.stringify(cart));

        });
      }
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    this.reloadCart()
  }

  goToPayment():void{
    localStorage.setItem("dvds", JSON.stringify(this.dvds));
    this.router.navigateByUrl("/payment");
  }

}
