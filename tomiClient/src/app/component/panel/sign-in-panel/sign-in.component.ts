import {Component, OnInit, NgZone, NgModule, ElementRef, Inject, AfterViewInit} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {DOCUMENT} from "@angular/common";
import {SignInService} from "../../../service/sign-in.service";
import {Router} from "@angular/router";
import {Meta} from "@angular/platform-browser";
import {BreakpointObserver, Breakpoints} from "@angular/cdk/layout";
import {UserAccount} from "../../../model/userAccount";

/**
 * SignInComponent is used to facilitate communication between the view and Google's OAuth2 sign in services.
 * @author Karol Talbot
 * @version 1.0
 */
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
export class SignInComponent implements OnInit, AfterViewInit {
  private large: boolean;

  constructor(@Inject(DOCUMENT) private document,
              private meta: Meta,
              private http: HttpClient,
              private ngZone: NgZone,
              private signIn: SignInService,
              private router: Router,
              private elementRef: ElementRef,
              private breakpointObserver: BreakpointObserver) {
    window['onSignIn'] = (user) => ngZone.run(() => this.onSignIn(user));
    breakpointObserver.observe([
      Breakpoints.XSmall,
      Breakpoints.Small,
      Breakpoints.Medium
    ]).subscribe(result => {
      if (result.matches) {
        this.large = false;
      } else {
        this.large = true;
      }
    });
  }

  ngOnInit() {
  }

  /**
   * After the view is loaded, adds the Google API script to the meta data.
   */
  ngAfterViewInit() {
    this.meta.addTag({
      name: 'google-signin-client_id',
      // content: '730191725836-6pv3tlbl520hai1tnl96nr0du79b7sfp.apps.googleusercontent.com' //localhost:4200
       content: '730191725836-os1al23f91okt57uactu0renuordqo1c.apps.googleusercontent.com' //localhost:8080
    });
    let s = this.document.createElement("script");
    s.type = "text/javascript";
    s.src = "https://apis.google.com/js/platform.js";
    this.elementRef.nativeElement.appendChild(s);
  }

  /**
   * Method called by the Google API on completion of sign in.
   * Navigates to the timesheets html page on successful log in.
   * @param googleUser The user signing in.
   */
  async onSignIn(googleUser) {
    this.signIn.setUser(googleUser);
    let id_token: string;
    id_token = googleUser.getAuthResponse().id_token;
    this.http.post("http://localhost:8080/tokensignin", id_token, httpOptions).toPromise().then(async(response) => {
      if(response != null){
        new Promise((resolve, reject)=>{
          resolve(this.setUser(response));
        }).then(()=>{
          this.router.navigate(['/my_timesheets']);
          this.signIn.setLoggedIn();
        });
      }
      return response;
    }).catch(() => {
      this.signIn.signOutOperations();
      return null;
    });
  }

  /**
   * Sets userAccount within the SignInService to the signed in user.
   * @param userAccount The UserAccount to set userAccount to.
   */
  async setUser(userAccount){
    return this.signIn.userAccount = userAccount as UserAccount;
  }

  /**
   * Returns the value of large.
   */
  public isLarge():boolean{
    return this.large;
  }
}


