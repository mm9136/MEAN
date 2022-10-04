import { Component, OnInit } from '@angular/core';

import { DvdService } from '../../services/dvd.service';
import { Dvd } from '../../classes/dvd';
import { DvdMovie } from '../../classes/dvd-movie';

import { User } from '../../classes/user';
import { Router } from '@angular/router';
import {UrlhistoryService} from "../../services/urlhistory.service";

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-manage-dvds',
  templateUrl: './manage-dvds.component.html',
  styleUrls: ['./manage-dvds.component.css']
})
export class ManageDVDsComponent implements OnInit {

  public err_msg: string;
  public alrt_msg: string;
  public succ_msg: string;
  public add_btn_d: boolean;
  public rm_btn_d: boolean;
  public mod_btn_d: boolean;

  public dvds: Dvd[] = [{
    _id: "new",
    name: "",
    price: undefined,
    quantity: undefined,
    description: undefined,
    movies: []
  }];

  public dvd = {
    _id: "",
    name: "",
    description: undefined,
    quantity: undefined,
    price: undefined,
    movies: [],
  }

  private user:User;

  constructor(private authService : AuthService, private dserv: DvdService,
              private router : Router, private urlHistoryService: UrlhistoryService) { }

  ngOnInit(): void {

    if(this.authService.jePrijavljen()) {
      this.user = this.authService.decodeToken();
      if (this.user.role != "admin") {
        this.router.navigateByUrl(this.urlHistoryService.vrniPredhodnjeUrlNaslove());
      }else{
        this.getDvds();
        this.dvd._id = "new";
        this.add_btn_d = false;
        this.rm_btn_d = true;
        this.mod_btn_d = true;
      }
    }else{
      this.router.navigateByUrl(this.urlHistoryService.vrniPredhodnjeUrlNaslove());
    }
  }

  public autocompleteDvd(id: string): void {
    if(id == "new") {
      this.setToDvd(null);

      this.add_btn_d = false;
      this.mod_btn_d = true;
      this.rm_btn_d = true;
      return;
    }

    for(let d of this.dvds) {
      if(d._id == id) {
        this.setToDvd(d);
        console.log(this.dvd.movies);

        this.add_btn_d = true;
        this.mod_btn_d = false;
        this.rm_btn_d = false;
        return;
      }
    }
    console.log("Error: could not find DVD");
  }

  public submit(method: string): void {
    if(method != "DELETE" && typeof this.dvd.name != "undefined" && this.dvd.name.trim() != "" &&
      typeof this.dvd.movies != "undefined" && this.dvd.movies.length > 0 &&
      typeof this.dvd.quantity != "undefined" && this.dvd.quantity > 0 &&
      typeof this.dvd.price != "undefined" && this.dvd.price >= 0 || method == "DELETE") {
        switch(method) {
          case "POST":
            this.dserv.addDvd(this.dvd).then(info => {
              this.dvds.push(info);
              this.setToDvd(info);
              this.succ_msg = this.setMsg("Successfully added DVD.");
              this.add_btn_d = true;
              this.mod_btn_d = false;
              this.rm_btn_d = false;
            }).catch(info => this.err_msg = this.setMsg(info));
            break;
          case "PUT":
            if(typeof this.dvd._id != "undefined" && this.dvd._id.trim() != "") {
              this.dserv.modifyDvd(this.dvd._id, this.dvd).then(info => {
                console.log(info);
                var i = this.indexOfId(info._id, this.dvds);
                if(i >= 0) this.dvds.splice(i, 1);
                this.dvds.push(info);
                this.setToDvd(info);
                this.succ_msg = this.setMsg("Successfully modified DVD.");
              }).catch(info => this.err_msg = this.setMsg(info));
            }
            break;
          case "DELETE":
            if(typeof this.dvd._id != "undefined" && this.dvd._id.trim() != "") {
              this.dserv.removeDvd(this.dvd._id).then(() => {
                var i = this.indexOfId(this.dvd._id, this.dvds);
                console.log("deleted "+i);
                if(i >= 0) this.dvds.splice(i, 1);
                this.setToDvd(null);
                this.add_btn_d = false;
                this.mod_btn_d = true;
                this.rm_btn_d = true;
              }).catch(info => this.err_msg = this.setMsg(info));
            }
            break;
          default: console.log(method);
        }
    } else {
      this.alrt_msg = this.setMsg("DVD name must not be empty, quantity and number of movies must be > 0, price must be >= 0.");
      console.log(this.dvd); console.log(method);
    }
  }

  public modifyMoviesOnDvd(m: string[]) {
    this.dvd.movies = m;
  }

  private getDvds(): void {
    this.dserv.getDvds().then(info => {
      if(info != null) {
        this.dvds = info;
        this.dvds.unshift({
          _id: "new",
          name: "New DVD",
          price: undefined,
          quantity: undefined,
          description: undefined,
          movies: []
        });
      }
    });
  }

  private setMsg(msg: string): string {
    this.alrt_msg = undefined;
    this.succ_msg = undefined;
    this.err_msg = undefined;
    return msg;
  }

  private setToDvd(d: Dvd): void {
    if(d == null || d == undefined) {
      this.dvd = {
        _id: "new",
        name: "",
        description: undefined,
        quantity: undefined,
        price: undefined,
        movies: [],
      }
    } else {
      this.dvd = {
        _id: d._id,
        name: d.name,
        description: d.description,
        quantity: d.quantity,
        price: d.price,
        movies: []
      }
      for(var m of d.movies)
        if(typeof m != "string") this.dvd.movies.push(m._id);
        else this.dvd.movies.push(m);
    }
  }

  private indexOfId(id: string, ds: Dvd[]) {
    for(var i = 0; i<ds.length; i++) {
      if(ds[i]._id == id) return i;
    }
    return -1;
  }

}
