import { Component, OnInit } from '@angular/core';

import { DecodedToken } from '../../classes/decoded-token';
import { Bill } from '../../classes/bill';
import { User } from '../../classes/user';
import { AuthService } from '../../services/auth.service';
import { BillService } from '../../services/bill.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {

  public bills: Bill[];
  private user:User;

  public error_msg :string;
  constructor(private authService: AuthService, private bserv: BillService,private router : Router ){

  }

  ngOnInit(): void {
    if(this.authService.jePrijavljen()) {
      this.user = this.authService.decodeToken();
      if (this.user.role != "user") {
        this.router.navigateByUrl("/");
      }else{
        this.getBills();
      }
    }else{
      this.router.navigateByUrl("/");
    }
  }

  private getBills(): void {
    const user: DecodedToken = this.authService.decodeTokenAsDT();
     this.bserv.getBillsByUser(user._id).then((info) => {
      this.bills = info;
    }).catch((info) => {
       this.error_msg = info;
     });
  }
}
