import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { DvdMovie } from '../classes/dvd-movie';

@Injectable({
  providedIn: 'root'
})
export class OmdbService {

  constructor(private http: HttpClient) { }

  private apiUrl = environment.extApiUrl;

  public getMovieDetails(m: DvdMovie): Promise<DvdMovie> {
    if(typeof m.imdb_id != "undefined" && m.imdb_id.trim() != "") return this.getFromIMDBID(m.imdb_id);
    else if(typeof m.title != "undefined" && m.title.trim() != "" && typeof m.year != "undefined" && m.year > 0) return this.getFromTitleYear(m.title, m.year);
    else if(typeof m.title != "undefined" && m.title.trim() != "") return this.getFromTitle(m.title);
    else return Promise.reject("Too few filled out fields.");
  }

  private getFromIMDBID(id: string): Promise<DvdMovie> {
    return this.http.get(this.apiUrl, {
      params: {
          i: id
      }
    }).toPromise().then((obj)=>{
      var data = obj as OmdbResponse;
      if(data.Response=="False") return Promise.reject(new Error(data.Error));
      return {
        imdb_id: id,
        title: data.Title,
        year: parseInt(data.Year),
        genre: data.Genre,
        description: data.Plot
      } as DvdMovie;
    }).catch(this.handleError);
  }

  private getFromTitleYear(title: string, year: number): Promise<DvdMovie> {
    return this.http.get(this.apiUrl, {
      params: {
          t: title,
          y: year.toString()
      }
    }).toPromise().then((obj)=>{
      var data = obj as OmdbResponse;
      if(data.Response=="False") return Promise.reject(new Error(data.Error));
      return {
        imdb_id: data.imdbID,
        title: data.Title,
        year: parseInt(data.Year),
        genre: data.Genre,
        description: data.Plot
      } as DvdMovie;
    }).catch(this.handleError);
  }

  private getFromTitle(title: string): Promise<DvdMovie> {
    return this.http.get(this.apiUrl, {
      params: {
          t: title
      }
    }).toPromise().then((obj)=>{
      var data = obj as OmdbResponse;
      if(data.Response=="False") return Promise.reject(data.Error);
      return {
        imdb_id: data.imdbID,
        title: data.Title,
        year: parseInt(data.Year),
        genre: data.Genre,
        description: data.Plot
      } as DvdMovie;
    }).catch(this.handleError);
  }

  private handleError(err: any): Promise<any> {
    if(typeof err.error != "undefined") {
      console.error('Error', err.error.errmsg || err.message || err);
      return Promise.reject(err.error.errmsg || err.message || err);
    } else {
      console.error('Error', err);
      return Promise.reject(err);
    }
  }

}

class OmdbResponse {
  Response: string;
  Error?: string;
  imdbID?: string;
  Title?: string;
  Year?: string;
  Genre?: string;
  Plot?: string;
  Rated?: string;
  Released?: string;
  Runtime?: string;
  Director?: string;
  Writer?: string;
  Actors?: string;
  Language?: string;
  Country?: string;
  Awards?: string;
  Poster?: string;
  Ratings?: any[];
  Metascore?: string;
  imdbRating?: string;
  imdbVotes?: string;
  Type?: string;
  DVD?: string;
  BoxOffice?: string;
  Production?: string;
  Website?: string;
}
