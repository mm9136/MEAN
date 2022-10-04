import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';

import { Genre } from '../classes/genre'


@Injectable({
  providedIn: 'root'
})
export class GenreService {

  constructor(private http: HttpClient) { }

  private apiUrl = environment.apiUrl;

  public getGenres(offset: number = undefined, limit: number = undefined): Promise<[Genre[], number]> {
    var url: string = `${this.apiUrl}/genres?`;
    if(typeof offset != "undefined" && typeof limit != "undefined") url += `offset=${offset}&limit=${limit}`;
    else if(typeof offset != "undefined") url += `offset=${offset}`;
    else if(typeof limit != "undefined") url += `limit=${limit}`;
    return this.http.get(url).toPromise().then(data => [data["info"] as Genre[], data["count"]]).catch(this.handleError);
  }

  private handleError(err:any): Promise<any> {
    console.error('Error', err.error["info"] || err.error.errmsg || err.message || err);
    return Promise.reject(err.error["info"] || err.error.errmsg || err.message || err);
  }

}
