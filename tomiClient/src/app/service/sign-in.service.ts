import { Injectable } from '@angular/core';
declare let gapi:any;

@Injectable({
  providedIn: 'root'
})
export class SignInService {
  user:any;

  constructor() { }

  setUser(user:any):any{
    this.user = user;
    return true;
  }

  getToken():string{
    let userToken = this.user.getAuthResponse().id_token;
    return userToken;
  }
}
