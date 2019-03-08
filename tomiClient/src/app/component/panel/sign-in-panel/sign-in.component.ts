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
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {
  signIn: SignInService;
  document:any;
  meta:Meta;

  constructor(@Inject(DOCUMENT) document, meta:Meta, private http: HttpClient, ngZone: NgZone, signIn: SignInService, private router: Router, private elementRef: ElementRef) {
    this.signIn = signIn;
    this.document = document;
    this.meta = meta;
    window['onSignIn'] = (user) => ngZone.run(() => this.onSignIn(user));
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.meta.addTag({name:'google-signin-client_id', content:'730191725836-6pv3tlbl520hai1tnl96nr0du79b7sfp.apps.googleusercontent.com'});
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
      if(response){
        this.router.navigate(['/my_timesheets']);
        this.signIn.setLoggedIn();
      }
      return response;
    }).catch(() => {
      this.signIn.signOutOperations();
      return null;
    });
  }
}


