import { Component, OnInit } from '@angular/core';
import { Dvd } from '../../classes/dvd';
import { DvdService } from '../../services/dvd.service';


@Component({
  selector: 'app-dvds',
  templateUrl: './dvds.component.html',
  styleUrls: ['./dvds.component.css']
})
export class DvdsComponent implements OnInit {

  public dvds: Dvd[] = [];

  public info_msg: boolean;
  public error_msg: boolean;

  constructor(private dvdService: DvdService) { }

  ngOnInit(): void {
    this.dvdService.getDvds(0).then(info => {
      if(info != null) this.dvds = info;
    }).catch(error =>{
      this.error_msg = error;
    });
  }

  public addToCart(data:string):void{
    var cart = [];
    if(localStorage.getItem("cart")){
      cart =  JSON.parse(localStorage.getItem("cart"));
    }
    var postoji = 0;
    for(var i =0; i<cart.length; i++){
      if(cart[i].dvd_id == data){
        cart[i].quantity++;
        postoji = 1;
      }
    }
    if(postoji == 0){
      cart.push({"dvd_id": data, "quantity": 1});
    }
    localStorage.setItem("cart",JSON.stringify(cart));

    this.dvdService.updateQuantity(data, "1", "0").then(() =>
      {
        this.info_msg = true;
        setTimeout(() => {this.info_msg = false;}, 3000);
      }
    ).catch(error => {
        alert(error);
        if(localStorage.getItem("cart")){
          cart =  JSON.parse(localStorage.getItem("cart"));
        }
        for(var i = 0; i<cart.length; i++){
          if(cart[i].dvd_id == data){
            cart[i].quantity--;
            if(cart[i].quantity < 1) cart.splice(i, 1);
          }
        }
        localStorage.setItem("cart",JSON.stringify(cart));
    });
  }

}
