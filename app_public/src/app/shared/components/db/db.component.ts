import { Component, OnInit } from '@angular/core';
import {DbService} from "../../services/db.service";

@Component({
  selector: 'app-db',
  templateUrl: './db.component.html',
  styleUrls: ['./db.component.css']
})
export class DbComponent implements OnInit {
  public create_msg = "";
  public delete_msg = "";

  constructor(private dbService: DbService) { }

  ngOnInit(): void {
  }

  createData():void {
    console.log("create");
    this.dbService.dbCreate().then(() => {
      this.create_msg = "Successfully created data!";
    }).catch(error => {
      console.log(error);
    });
  }
  deleteData():void {
    console.log("delete");
    this.dbService.dbDelete().then(() => {
      this.delete_msg = "Successfully deleted data!";
    }).catch(error => {
      console.log(error);
    });
  }
}
