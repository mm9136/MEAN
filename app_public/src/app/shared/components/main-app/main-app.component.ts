import { Component, OnInit } from '@angular/core';
import {UrlhistoryService} from "../../services/urlhistory.service";
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { DecodedToken } from '../../classes/decoded-token';
import { UserControlService } from '../../services/user-control.service';
import { User } from '../../classes/user';
import { PovezavaService } from '../../services/povezava.service';


@Component({
  selector: 'main-app',
  templateUrl: './main-app.component.html',
  styleUrls: ['./main-app.component.css']
})


export class MainAppComponent implements OnInit {
  public isAdmin: boolean = false;
  public isUser: boolean = false;
  public noUser: boolean = true;
  public username: string;
  private userType: string = "guest";

  constructor(private authService: AuthService,private povezavaStoritev: PovezavaService,private uservice: UserControlService,
              private router : Router) {
    uservice.login$.subscribe(log => {
      if(log) this.login();
    });
    uservice.refresh$.subscribe((r) => {
      if(r) {
        uservice.setUserType(this.userType);
      }
    });

  }

  ngOnInit(): void {
    try {
      const user: DecodedToken = this.authService.decodeTokenAsDT();
      if(user == undefined) return;
      var timediff = user.exp - (new Date()).getTime() / 1000;
      if (user.role == "admin" && timediff > 0) {
        this.isAdmin = true;
        this.isUser = false;
        this.noUser = false;
        this.userType = "admin";
        this.uservice.setUserType("admin");
        setTimeout(() => this.logout, timediff);
      } else if (user.role == "user" && timediff > 0) {
        this.isUser = true;
        this.noUser = false;
        this.username = user.firstname + " " + user.lastname;
        this.userType = "user";
        this.uservice.setUserType("user");
        setTimeout(() => this.logout, timediff);
      } else {
        this.authService.removeToken();
        this.userType = "guest";
        this.uservice.setUserType("guest");
      }
    }catch (error){
      console.error(error);
    }
  }
  public jePovezava(): boolean {
    return this.povezavaStoritev.jePovezava;
  }


  public login(): void {
    var token: DecodedToken = this.authService.decodeTokenAsDT();
    this.userType = token.role || "guest";
    this.uservice.setUserType(this.userType);
    this.isAdmin = false; this.isUser = false; this.noUser = false;
    setTimeout(() => this.logout, token.exp - (new Date()).getTime() / 1000);
    switch(token.role) {
      case "user":
        this.isUser = true;
        this.username = token.firstname + " " + token.lastname;
        break;
      case "admin":
        this.isAdmin = true;
        break;
      default:
        this.noUser = true;
    }
  }

  public logout(): void {
    this.authService.logout();
    this.isAdmin = false; this.isUser = false; this.noUser = true;
    this.uservice.setLoggedIn(false);
    this.uservice.setUserType("guest");
    this.userType = "guest";
    this.router.navigateByUrl("/");
  }

}
