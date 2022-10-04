import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import  {BillService} from "../../services/bill.service"

@Component({
  selector: 'app-successful-transaction',
  templateUrl: './successful-transaction.component.html',
  styleUrls: ['./successful-transaction.component.css']
})
export class SuccessfulTransactionComponent implements OnInit {
  public  order_id;
  constructor(private billService:BillService, private route: ActivatedRoute) {
    this.route.params.subscribe(parameter => {
      this.order_id = parameter.order_id;
    });
  }

  ngOnInit(): void {
  }

  download():void{
    this.billService.downloadPDF(this.order_id);
  }
}
