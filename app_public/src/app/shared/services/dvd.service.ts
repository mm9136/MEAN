import { Inject, Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';

import { Dvd } from '../classes/dvd'
import { TOKEN_SESSION } from '../classes/token-session';

@Injectable({
  providedIn: 'root'
})
export class DvdService {

  constructor(private http: HttpClient, @Inject(TOKEN_SESSION) private localStorage: Storage) { }

  private apiUrl = environment.apiUrl;

  public getDvds(min_q: number = undefined): Promise<Dvd[]> {
    var url: string = `${this.apiUrl}/dvds`;
    if(typeof min_q != "undefined") url += "?minq="+min_q;
    return this.http.get(url).toPromise().then(data => data["info"] as Dvd[]).catch(this.handleError);
  }

  public addDvd(d: Dvd): Promise<Dvd> {
    const url: string = `${this.apiUrl}/dvds`;
    const properties = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json;charset=UTF-8',
        'Authorization': `Bearer ${this.localStorage.getItem('token')}`
      })
    };
    return this.http
      .post(url, d, properties)
      .toPromise()
      .then(data => data["info"] as Dvd)
      .catch(this.handleError);
  }

  public modifyDvd(id: string, d: Dvd): Promise<Dvd> {
    const url: string = `${this.apiUrl}/dvds/id/${id}`;
    const properties = {
      headers: new HttpHeaders({
        //'Content-Type': 'application/json;charset=UTF-8',
        'Authorization': `Bearer ${this.localStorage.getItem('token')}`
      })
    };
    return this.http
      .put(url, d, properties)
      .toPromise()
      .then(data => data["info"] as Dvd)
      .catch(this.handleError);
  }

  public removeDvd(id: string): Promise<any> {
    const url: string = `${this.apiUrl}/dvds/id/${id}`;
    const properties = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.localStorage.getItem('token')}`
      })
    };
    return this.http.delete(url, properties).toPromise().then().catch(this.handleError);
  }

  public updateQuantity(data:string, quantity:string, operation:string): Promise<Dvd[]> {
    const url: string = `${this.apiUrl}/dvds/qty?dvd_id=` + data + `&quantity=` + quantity + `&operation=` + operation + ``;
    return this.http.get(url).toPromise().then().catch(this.handleError);
  }

  public getDvdById(id:string): Promise<Dvd> {
    const url: string = `${this.apiUrl}/dvds/id/${id}`;
    const properties = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.localStorage.getItem('token')}`
      })
    };
    return this.http.get(url, properties).toPromise().then(data => data["info"] as Dvd).catch(this.handleError);
  }




  private handleError(err:any):Promise<any> {
    console.error('Error', err.error["info"] || err.error.errmsg || err.message || err);
    return Promise.reject(err.error["info"] || err.error.errmsg || err.message || err);
  }


}
