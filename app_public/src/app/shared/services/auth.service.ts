import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import jwt_decode from 'jwt-decode';

import { environment } from '../../../environments/environment';


import { User } from '../classes/user';
import { Token } from '../classes/token';
import { TOKEN_SESSION } from '../classes/token-session';
import { DecodedToken } from '../classes/decoded-token';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  constructor(private http: HttpClient, @Inject(TOKEN_SESSION) private localStorage: Storage) { }

  public login(user: User): Promise<any> {
    const url: string = `${this.apiUrl}/users/login`;
    return this.http.post(url, user)
      .toPromise()
      .then(data => {
        this.saveToken(data["info"]);
      }).catch(this.handleError);
  }


  public registerUser(user: User): Promise<any>{
    const url: string = `${this.apiUrl}/users/register`;
    return this.http.post(url, user)
      .toPromise()
      .then(data => data as Token)
      .catch(this.handleError);
  }

  public changePassword(user: User): Promise<Token>{
    const auth = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.localStorage.getItem('token')}`
      })
    };

    const url: string = `${this.apiUrl}/users/changePassword`;
    return this.http.post(url, user, auth)
      .toPromise()
      .then(data => data as Token)
      .catch(this.handleError);
  }

  public saveToken(token: string){
    this.localStorage.setItem("token", token);
  }

  public decodeToken(): User {
    var token = this.getToken();
    // var { _id, firstname, lastname, email, role } = JSON.parse(this.b64Utf8(token.split('.')[1]));//atob je bil namesto this.b64Utf8
    //return { _id, firstname, lastname, email, role } as User;
    return jwt_decode(token) as User;
  }

  public decodeTokenAsDT(): DecodedToken {
    const token = this.getToken();
    if(token == undefined || token == null) return undefined;
    return jwt_decode(token) as DecodedToken;
  }

  public getToken() : string{
    return this.localStorage.getItem("token");
  }

  public removeToken(): void {
    this.localStorage.removeItem("token");
  }

  private handleError(err:any):Promise<any> {
    console.error('Error', err.error["info"] || err.error.errmsg || err.message || err);
    return Promise.reject(err.error["info"] || err.error.errmsg || err.message || err);
  }

  public logout() : void{
    this.localStorage.removeItem("token");
  }
  private b64Utf8(niz: string): string {
    return decodeURIComponent(
      Array.prototype.map
        .call(
          atob(niz),
          (znak: string) => {
            return '%' + ('00' + znak.charCodeAt(0).toString(16)).slice(-2);
          }
        )
        .join('')
    );
  };
  public jePrijavljen(): boolean {
    const token: string = this.getToken();
    if (token) {
      const koristnaVsebina = JSON.parse(this.b64Utf8(token.split('.')[1]));
      return koristnaVsebina.exp > (Date.now() / 1000);
    } else {
      return false;
    }
  }
}
