import {Component, OnInit, NgZone, NgModule} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {SignInService} from "../../../service/sign-in.service";

declare let gapi:any;

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@NgModule({
  providers: [SignInService],
})
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  signIn:SignInService;

  constructor( private http: HttpClient, ngZone: NgZone, signIn:SignInService) {
    window['onSignIn'] = (user) => ngZone.run(() => this.onSignIn(user));
    this.signIn = signIn;
  }

  ngOnInit() {
  }

  signOut(){
    let auth2 = gapi.auth2.getAuthInstance();

    auth2.signOut().then(function () {
      console.log('User signed out.');
    });
  }

  onSignIn(googleUser){
    this.signIn.setUser(googleUser);
    let id_token:string;
      id_token = googleUser.getAuthResponse().id_token;
    console.log(googleUser.getBasicProfile());
    this.http.post("http://localhost:8080/tokensignin", id_token, httpOptions).toPromise().then(response => {
      return response;
    }).catch(() => {
      return null;
    });
  }
}

