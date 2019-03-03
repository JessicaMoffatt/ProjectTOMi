import {Component, OnInit, NgZone, NgModule, ElementRef, Inject} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {DOCUMENT} from "@angular/common";
import {SignInService} from "../../../service/sign-in.service";
import {Router} from "@angular/router";
import {Meta} from "@angular/platform-browser";

declare let gapi: any;

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@NgModule({
  providers: [SignInService],
})
@Component({
  selector: 'app-login',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {
  signIn: SignInService;
  document:any;

  constructor(@Inject(DOCUMENT) document, private meta: Meta, private http: HttpClient, ngZone: NgZone, signIn: SignInService, private router: Router, private elementRef: ElementRef) {
    window['onSignIn'] = (user) => ngZone.run(() => this.onSignIn(user));
    this.signIn = signIn;
    this.document = document;
    meta.addTag({name:'google-signin-client_id', content:'730191725836-6pv3tlbl520hai1tnl96nr0du79b7sfp.apps.googleusercontent.com'});
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    let s = this.document.createElement("script");
    s.type = "text/javascript";
    s.src = "https://apis.google.com/js/platform.js";
    this.elementRef.nativeElement.appendChild(s);
  }

  async onSignIn(googleUser) {
    this.signIn.setUser(googleUser);
    let id_token: string;
    id_token = googleUser.getAuthResponse().id_token;
    this.http.post("http://localhost:8080/tokensignin", id_token, httpOptions).toPromise().then(response => {
      this.router.navigate(['/timesheets']);
      return response;
    }).catch(() => {
      return null;
    });
  }
}

