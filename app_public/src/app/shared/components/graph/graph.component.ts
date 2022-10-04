import { Component, OnInit } from '@angular/core';
import { Bill } from '../../classes/bill';
import { BillService } from '../../services/bill.service';
import { UserControlService } from '../../services/user-control.service';

import { User } from '../../classes/user';
import { Router } from '@angular/router';
import {UrlhistoryService} from "../../services/urlhistory.service";

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css']
})
export class GraphComponent implements OnInit {

  public data: any[] = [];
  public bestMoviePercentage = 0;
  public bestMovieTitle = "";
  private user:User;

  public error_msg :string;
  constructor(private authService : AuthService, private bserv: BillService, private uservice: UserControlService,
              private router : Router, private urlHistoryService: UrlhistoryService) {
    uservice.userType$.subscribe(type => {
      if(type == "admin") this.getBills();
    });
  }

  ngOnInit(): void {
    if(this.authService.jePrijavljen()) {
      this.user = this.authService.decodeToken();
      if (this.user.role != "admin") {
        this.router.navigateByUrl(this.urlHistoryService.vrniPredhodnjeUrlNaslove());
      }else{
        this.uservice.reloadData();
      }
    }else{
      this.router.navigateByUrl(this.urlHistoryService.vrniPredhodnjeUrlNaslove());
    }
  }

  private getBills(): void {
    this.bserv.getBills().then((info) => {
      this.data = this.getData(info);
      var count = 0;
      var max = 0;
      for (var i= 0; i<this.data.length; i++){
        count += this.data[i][1];
        if(this.data[i][1] > max){
          max = this.data[i][1];
          this.bestMovieTitle = this.data[i][0];
        }
      }
      this.bestMoviePercentage = max/count;
    }).catch((info) => {
      this.error_msg= info;
    });
  }

  private getData(bills: Bill[]): any[] {
    var ids: string[] = [];
    var ret: any[] = [];
    for(var b of bills) {
      for(var d of b.dvd) {
        //for(var m of d.movies) {
          var i = ids.indexOf(d.name);
          if(i < 0) {
            ids.push(d.name);
            ret.push([d.name, d.quantity]);
          } else ret[i][1] += d.quantity;
        //}
      }
    }
    return ret;
  }

}
