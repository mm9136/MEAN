import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../services/auth.service';
import { BillService } from '../../services/bill.service';
import { User } from '../../classes/user';
import { Bill } from '../../classes/bill';
import { BillDvd } from '../../classes/bill';
import { BillMovie} from '../../classes/bill';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {
  private user : User;
  public card = {
    holderName: "",
    cardNumber: "5555555555554444",
    expityMonth: "",
    expityYear: "",
    cvvCode: ""
  };

  public payment_btn_d: boolean = true;

  constructor(private authService : AuthService, private billService : BillService, private router : Router) {
  }

  ngOnInit(): void {
  }


  valCvvCode(cvv: string) : void{
      var flag =  (cvv.length == 3) && (Number(cvv) ? true : false);
      if(this.valCardNumber(this.card.cardNumber) && this.valExpYear(this.card.expityYear) && flag
        && this.card.expityMonth != "" && this.card.holderName != ""){
        this.payment_btn_d = false;
      }
   };

  valCardNumber(inputNum: string): boolean {
    var digit, digits, flag, sum, _i, _len;
    flag = true;
    sum = 0;
    digits = (inputNum + '').split('').reverse();
    for (_i = 0, _len = digits.length; _i < _len; _i++) {
      digit = digits[_i];
      digit = parseInt(digit, 10);
      if ((flag = !flag)) {
        digit *= 2;
      }
      if (digit > 9) {
        digit -= 9;
      }
      sum += digit;
    }
    return sum % 10 === 0;
  }

  valExpYear(year: string): boolean{
      return (year.length == 4) && (Number(year) ? true : false);
  }

  payment():void{
        this.user = this.authService.decodeToken();
        var cart = JSON.parse(localStorage.getItem("dvds"));
        var total = 0;
        for(var i = 0; i<cart.length; i++) {
         total += cart[i].price * cart[i].quantity;
         var movies = [];

          for(var j = 0; j<cart[i].movies.length; j++){
            movies.push({"id": cart[i].movies[j]._id, "title": cart[i].movies[j].title, "year": cart[i].movies[j].year});
          }
          cart[i].movies = movies;
        }
        var bill = {"dvd":cart, "total": total, "user": this.user._id};


        this.billService.addBill(JSON.stringify(bill)).then(data => {
          localStorage.removeItem("dvds");
          localStorage.removeItem("cart");
          this.router.navigateByUrl('/successfultransaction/' + data._id);
        }).catch(error => {
            console.log(error);
        });

  }

  public goToShoppingCart(){
    this.router.navigateByUrl('/shoppingcart');
  }
}


