import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { User } from '../../classes/user';
import { Router } from '@angular/router';
import {UrlhistoryService} from "../../services/urlhistory.service";

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
  public alrt_msg: string;
  private user:User;

  constructor(private authService : AuthService, private router : Router, private urlHistoryService: UrlhistoryService) {
  }

  public userData = {
    passwordC: "",
    newPasswordC: "",
    confirmC: ""
  }
  public err_msg : string;
  public err_msg_confirm : string;
  public err_msg_old : string;
  public change_btn_d: boolean = true;
  public border_color_passwordC: string = "#eee";
  public border_color_newpasswordC: string = "#eee";
  public border_color_confirmC: string = "#eee";

  ngOnInit(): void {
      if(this.authService.jePrijavljen()) {
        this.user = this.authService.decodeToken();
        if (this.user.role != "user") {
          this.router.navigateByUrl("/");
        }
      }else{
        this.router.navigateByUrl("/");
      }
  }

  changePassword() : void{

    var email = this.user.email;
    var password = (<HTMLInputElement> document.getElementById('newPasswordC')).value;
    var data = {
      '_id': '',
      'firstname': '',
      'lastname': '',
      'email': email,
      'password': password,
      'role': ''
    };

    this.authService.changePassword(data).then(() => {
      this.alrt_msg = "Password successfully changed!";
    });
  }

  public validation(){
    if (this.passRegex(this.userData.passwordC) &&
      this.passRegex(this.userData.newPasswordC) && this.passRegex(this.userData.confirmC)
      && this.userData.newPasswordC == this.userData.confirmC) {
      this.change_btn_d = false;
    }else{
      this.change_btn_d = true;
    }
  }


  public valPasswordC(p: string) {
    if ( this.passRegex(p) &&  p != "") {
      this.border_color_passwordC = "#0f0";
      this.err_msg_old = "";
    }
    else {
      this.border_color_passwordC = "#f00";
      this.err_msg_old = "Old password must contain at least 3 characters!";
    }
    this.validation();
  }

  public valNewPasswordC(p: string) {
      if ( this.passRegex(p) &&  p != "") {
        this.border_color_newpasswordC = "#0f0";
        this.err_msg = "";
      }else {
        this.border_color_newpasswordC = "#f00";
        this.err_msg = "New password must contain at least 3 characters!";
      }
      this.validation();
    }

  public valConfirmC(p: string) {
    if ( this.passRegex(p) &&  p != "" && p == this.userData.newPasswordC) {
      this.border_color_confirmC = "#0f0";
      this.err_msg_confirm = "";
    }
    else if( p != this.userData.newPasswordC){
      this.border_color_confirmC = "#f00";
      this.err_msg_confirm = "Password and confirm password are not equal!";
    }
    else {
      this.border_color_confirmC = "#f00";
      this.err_msg_confirm = "Confirm password must contain at least 3 characters!";
    }
    this.validation();
  }



  passRegex(p:string): boolean{
    if (/^[\w@#$%*()!?]{3,20}$/.test(p)) return true;
    return false;
  }

}
