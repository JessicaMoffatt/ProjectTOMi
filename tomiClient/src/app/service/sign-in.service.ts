import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {TopNavBarComponent} from "../component/panel/top-nav-bar/top-nav-bar.component";
import {Router} from "@angular/router";
declare let gapi:any;

@Injectable({
  providedIn: 'root'
})
export class SignInService {
  user:any;
  public isUserLoggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  router:Router;
  constructor(router:Router) {
    this.router = router;
  }


  setUser(user:any):any{
    this.user = user;
    return true;
  }

  setLoggedIn(){
    this.isUserLoggedIn.next(true);
  }

  async signOut() {
    let auth2 = gapi.auth2.getAuthInstance();

    let promise = new Promise((resolve, reject)=>{
      resolve(auth2.signOut());
    });

    await promise.then(()=>{
      return this.signOutOperations();
    });
  }

  signOutOperations() {
    this.setUser(null);
    this.isUserLoggedIn.next(false);
    return this.router.navigate(['/']);
  }

  getToken():string{
    let userToken = this.user.getAuthResponse().id_token;
    return userToken;
  }
}
