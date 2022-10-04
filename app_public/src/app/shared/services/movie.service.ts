import { Inject, Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';

import { Movie } from '../classes/movie'
import { DvdMovie } from '../classes/dvd-movie';
import { TOKEN_SESSION } from '../classes/token-session';

@Injectable({
  providedIn: 'root'
})
export class MovieService {

  constructor(private http: HttpClient, @Inject(TOKEN_SESSION) private localStorage: Storage) { }

  private apiUrl = environment.apiUrl;

  public getMovies(offset: number = undefined, limit: number = undefined): Promise<[Movie[], number]> {
    var url: string = `${this.apiUrl}/movies?`;
    if(typeof offset != "undefined" && typeof limit != "undefined") url += `offset=${offset}&limit=${limit}`;
    else if(typeof offset != "undefined") url += `offset=${offset}`;
    else if(typeof limit != "undefined") url += `limit=${limit}`;
    return this.http.get(url).toPromise().then(data => [data["info"] as Movie[], data["count"]]).catch(this.handleError);
  }

  public getMovieById(id: number): Promise<Movie> {
    const url: string = `${this.apiUrl}/movies/id/${id}`;
    return this.http.get(url).toPromise().then(data => data["info"] as Movie).catch(this.handleError);
  }

  public search(q: string, g: string): Promise<Movie[]> {
    var url: string = `${this.apiUrl}/search?`;
    if(typeof q != "undefined" && q.trim() != "" && typeof g != "undefined" && g.trim() != "")
        url+="q="+q.replace(" ", "+")+"&g="+g.replace(" ", "+");
    else if(typeof q != "undefined" && q.trim() != "") url+="q="+q.replace(" ", "+");
    else if(typeof g != "undefined" && g.trim() != "") url+="g="+g.replace(" ", "+");
    else {
      return Promise.reject("One of the fields must not be empty.");
    } return this.http.get(url).toPromise().then(data => data["info"] as Movie[]).catch(this.handleError);
  }

  public autocomplete(query: string): Promise<DvdMovie> {
    const url: string = `${this.apiUrl}/movies/autocomplete?${query}`;
    return this.http.get(url).toPromise().then(data => data["info"] as DvdMovie).catch(this.handleError);
  }

  public addMovie(m: DvdMovie): Promise<Movie> {
    const url: string = `${this.apiUrl}/movies`;
    const properties = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json;charset=UTF-8',
        'Authorization': `Bearer ${this.localStorage.getItem('token')}`
      })
    };
    return this.http
      .post(url, m, properties)
      .toPromise()
      .then(data => data["info"] as Movie)
      .catch(this.handleError);
  }

  public modifyMovie(id: string, m: DvdMovie): Promise<Movie> {
    const url: string = `${this.apiUrl}/movies/id/${id}`;
    const properties = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json;charset=UTF-8',
        'Authorization': `Bearer ${this.localStorage.getItem('token')}`
      })
    };
    return this.http
      .put(url, m, properties)
      .toPromise()
      .then(data => data["info"] as Movie)
      .catch(this.handleError);
  } 

  public removeMovie(id: string): Promise<any> {
    const url: string = `${this.apiUrl}/movies/id/${id}`;
    const properties = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json;charset=UTF-8',
        'Authorization': `Bearer ${this.localStorage.getItem('token')}`
      })
    };
    return this.http.delete(url, properties).toPromise().then().catch(this.handleError);
  }

  private handleError(err: any):Promise<any> {
    console.error('Error', err.error["info"] || err.error.errmsg || err.message || err);
    return Promise.reject(err.error["info"] || err.error.errmsg || err.message || err);
  }

}
