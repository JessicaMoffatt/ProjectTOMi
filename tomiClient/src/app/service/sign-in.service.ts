import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {TopNavBarComponent} from "../component/panel/top-nav-bar/top-nav-bar.component";
declare let gapi:any;

@Injectable({
  providedIn: 'root'
})
export class SignInService {
  user:any;
  public isUserLoggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor() { }


  setUser(user:any):any{
    this.user = user;
    return true;
  }

  setLoggedIn(){
    this.isUserLoggedIn.next(true);
  }

  signOut() {
    let auth2 = gapi.auth2.getAuthInstance();

    auth2.signOut().then(this.signOutOperations()
    );
  }

  signOutOperations() {
    this.setUser(null);
    this.isUserLoggedIn.next(false);
  }

  getToken():string{
    let userToken = this.user.getAuthResponse().id_token;
    return userToken;
  }
}
