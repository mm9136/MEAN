import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

import {UrlhistoryService} from "../../services/urlhistory.service";
import { User } from '../../classes/user';
import { PovezavaService } from '../../services/povezava.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})


export class RegisterComponent implements OnInit {


  public alrt_msg: string;
  public err_msg: string;
  public err_msg_email: string;
  public err_msg_confirm: string;

  public register_btn_d: boolean = true;
  public border_color_firstname: string = "#eee";
  public border_color_lastname: string = "#eee";
  public border_color: string = "#eee";
  public border_color_pass: string = "#eee";
  public border_color_confirm: string = "#eee";

  public user = {
    firstname:"",
    lastname:"",
    email: "",
    password: "",
    confirm:""
  };
  private userLoggedIn:User;

  constructor(private authService: AuthService, private povezavaStoritev: PovezavaService,
              private router : Router, private urlHistoryService: UrlhistoryService) { }

  ngOnInit(): void {
    if(this.authService.jePrijavljen()) {
      this.userLoggedIn = this.authService.decodeToken();
      this.router.navigateByUrl(this.urlHistoryService.vrniPredhodnjeUrlNaslove());
    }
  }
  public jePovezava(): boolean {
    return this.povezavaStoritev.jePovezava;
  }

  register(): void {
    const firstname = (<HTMLInputElement> document.getElementById('firstnameR')).value;
    var lastname = (<HTMLInputElement> document.getElementById('lastnameR')).value;
    var email = (<HTMLInputElement> document.getElementById('emailR')).value;
    var password = (<HTMLInputElement> document.getElementById('passwordR')).value;
    var loginData = {
      '_id': '',
      'firstname': firstname,
      'lastname': lastname,
      'email': email,
      'password': password,
      'role': ''
    };

    this.authService.registerUser(loginData).
    then(() => {
      this.alrt_msg = "Registration successfull!";
    }).catch(error => {
        this.err_msg = error;
    });

  }

  public redirectToLogin() {
    this.router.navigate(["/login"]);
  }

  public validation(){
    if (this.validateEmail(this.user.email) && this.user.firstname != "" && this.user.lastname != "" &&
      this.passRegex(this.user.password) && this.passRegex(this.user.confirm) && this.user.password == this.user.confirm) {
      this.register_btn_d = false;
    }else{
      this.register_btn_d = true;
    }
  }
  public valPassword(p: string) {
    if ( this.passRegex(p) &&  p != "") {
      this.border_color_pass = "#0f0";
      this.err_msg = "";
    }
    else {
      this.border_color_pass = "#f00";
      this.err_msg = "Password must contain at least 3 characters!";
    }
    this.validation();
  }

  public valConfirm(p: string) {
    if ( this.passRegex(p) &&  p != "" && p == this.user.password) {
      this.border_color_confirm = "#0f0";
      this.err_msg_confirm = "";
    }
    else if( p != this.user.password){
      this.border_color_confirm = "#f00";
      this.err_msg_confirm = "Password and confirm password are not equal!";
    }
    else {
      this.border_color_confirm = "#f00";
      this.err_msg_confirm = "Confirm password must contain at least 3 characters!";
    }
    this.validation();
  }

  passRegex(p:string): boolean{
    if (/^[\w@#$%*()!?]{3,20}$/.test(p)) return true;
    return false;
  }

  public valLastname(e: string) {
    if (e == "") {
      this.border_color_lastname = "#f00";
    } else {
      this.border_color_lastname = "#0f0";
    }
    this.validation();
  }


  public valFirstname(e: string) {
    if (e == "") {
      this.border_color_firstname = "#f00";
    } else {
      this.border_color_firstname = "#0f0";
    }
    this.validation();
  }


  public valEmail(e: string) {
    if (!this.validateEmail(e)) {
      this.border_color = "#f00";
      this.err_msg_email = "Email must contain @!";
    } else {
      this.border_color = "#0f0";
      this.err_msg_email = "";
    }
    this.validation();
  }

  private validateEmail(email): boolean {
    var re = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    return re.test(email);
  }
}
