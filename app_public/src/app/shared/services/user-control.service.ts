import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserControlService {

  private login = new Subject<boolean>();
  private userType = new Subject<string>();
  private refresh = new Subject<boolean>();

  public login$ = this.login.asObservable();
  public userType$ = this.userType.asObservable();
  public refresh$ = this.refresh.asObservable();

  public setLoggedIn(status: boolean) {
    this.login.next(status);
  }

  public setUserType(type: string) {
    this.userType.next(type);
  }

  public reloadData(): void {
    this.refresh.next(true);
  }

  constructor() { }
}
