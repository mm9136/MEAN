import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { UserControlService } from '../../services/user-control.service';
import {UrlhistoryService} from "../../services/urlhistory.service";

import { User } from '../../classes/user';

import { PovezavaService } from '../../services/povezava.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public err_msg: string;
  public login_btn_d: boolean = true;
  public border_color: string = "#eee";
  public border_color_pass: string = "#eee";
  private userLoggedIn:User;

  public user = {
    email: "",
    password: ""
  }

  constructor(private authService : AuthService, private router : Router, private povezavaStoritev: PovezavaService,
              private uservice: UserControlService,private urlHistoryService: UrlhistoryService) { }


  ngOnInit(): void {
    if(this.authService.jePrijavljen()) {
      this.userLoggedIn = this.authService.decodeToken();
      this.router.navigateByUrl(this.urlHistoryService.vrniPredhodnjeUrlNaslove());
    }
  }
  public jePovezava(): boolean {
    return this.povezavaStoritev.jePovezava;
  }
  public login(): void {

    var email = (<HTMLInputElement> document.getElementById('email')).value;
    var password = (<HTMLInputElement> document.getElementById('password')).value;
    var loginData = {
      '_id': '',
      'firstname': '',
      'lastname': '',
      'email': email,
      'password': password,
      'role': ''
    };
    this.authService.login(loginData).then(() => {
      this.uservice.setLoggedIn(true);
      this.router.navigateByUrl(
        this.urlHistoryService.vrniPredhodnjeUrlNasloveBrezPrijaveInRegistracije());
      this.err_msg = undefined;
    }).catch(error => {
      this.err_msg = error.info;
    });
  }

  public redirectToRegister() {
    this.router.navigate(["/register"]);
  }

  public validation(){
    if (this.validateEmail(this.user.email) && this.user.password!="" && this.passRegex(this.user.password)) {
      this.login_btn_d = false;
    }else{
      this.login_btn_d = true;
    }
  }

  public valPassword(p: string) {
    if ( this.passRegex(p) &&  p != "") {
      this.border_color_pass = "#0f0";
    }
    else {
      this.border_color_pass = "#f00";
    }
    this.validation();
  }
    passRegex(p:string): boolean{
      if (/^[\w@#$%*()!?]{3,20}$/.test(p)) return true;
      return false;
    }

  public valEmail(e: string) {
    if (!this.validateEmail(e)) {
      this.border_color = "#f00";
    } else {
      this.border_color = "#0f0";
    }
    this.validation();
  }

  private validateEmail(email): boolean {
    var re = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    return re.test(email);
  }

}
