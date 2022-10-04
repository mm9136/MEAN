import { Inject, Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Bill } from '../classes/bill';
import { TOKEN_SESSION } from '../classes/token-session';
import { saveAs } from 'file-saver';

@Injectable({
  providedIn: 'root'
})
export class BillService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, @Inject(TOKEN_SESSION) private localStorage: Storage) { }

  public getBills(): Promise<Bill[]> {
    var url: string = `${this.apiUrl}/bills`;
    const properties = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.localStorage.getItem('token')}`
      })
    };
    return this.http.get(url, properties).toPromise().then(data => data["info"] as Bill[]).catch(this.handleError);
  }


  public addBill(bill: string): Promise<Bill>{
    const url: string = `${this.apiUrl}/bills`;
    const properties = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.localStorage.getItem('token')}`
      })
    };
    return this.http.post(url, JSON.parse(bill), properties)
      .toPromise()
      .then(data => data["info"] as Bill)
      .catch(this.handleError);
  }



public downloadPDF(order_id: string): void {
  var mediaType = 'application/pdf';
  var url: string = `${this.apiUrl}/bills/id/${order_id}/pdf`;
  this.http.post(url, {location: "report.pdf"}, { headers: new HttpHeaders({
      'Authorization': `Bearer ${this.localStorage.getItem('token')}`}), responseType: 'blob' }).subscribe(
    (response) => {
      var blob = new Blob([response], { type: mediaType });
      saveAs(blob, 'report.pdf');
    },
    e => { this.handleError(e); }
  );
}
  public getBillsByUser(user_id: string): Promise<Bill[]> {
    var url: string = `${this.apiUrl}/bills/user/` + user_id;
    const properties = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.localStorage.getItem('token')}`
      })
    };
    return this.http.get(url, properties).toPromise().then(data => data["info"] as Bill[]).catch(this.handleError);
  }

  private handleError(err:any):Promise<any> {
    console.error('Error', err.error["info"] || err.error.errmsg || err.message || err);
    return Promise.reject(err.error["info"] || err.error.errmsg || err.message || err);
  }


}
