import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DbService {
  constructor(private http: HttpClient) { }

  private apiUrl = environment.apiUrl;

  public dbCreate(): Promise<any> {
    var url: string = `${this.apiUrl}/create`;
    return this.http.post(url,"").toPromise().then().catch(this.handleError);
  }

  public dbDelete(): Promise<any> {
    var url: string = `${this.apiUrl}/delete`;
    return this.http.post(url, "").toPromise().then().catch(this.handleError);
  }

  private handleError(err:any): Promise<any> {
    console.error('Error', err.error["info"] || err.error.errmsg || err.message || err);
    return Promise.reject(err.error["info"] || err.error.errmsg || err.message || err);
  }
}
