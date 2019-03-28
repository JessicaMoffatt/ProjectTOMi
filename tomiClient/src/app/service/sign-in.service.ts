import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {Router} from "@angular/router";
import {MatSnackBar} from "@angular/material";
import {HttpClient} from "@angular/common/http";
import {map} from "rxjs/operators";
import {UserAccount} from "../model/userAccount";
import {buildNavBarUrl} from "../configuration/domainConfiguration";

declare let gapi:any;

/**
 * @author Karol Talbot
 * @version 1.0
 */
@Injectable({
  providedIn: 'root'
})
export class SignInService {
  private user:any;
  private isUserLoggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public navList:Array<any> = [];
  userAccount:UserAccount = null;

  constructor(private router:Router, private snackBar:MatSnackBar, private http:HttpClient) {
    this.router = router;
    this.snackBar = snackBar;
    this.http = http;
  }

  setUser(user:any):boolean{
    this.user = user;
    return true;
  }

  isLoggedIn(){
    return this.isUserLoggedIn;
  }

  async setLoggedIn(){
    let promise = new Promise((resolve, reject)=>{
      resolve(this.getNavBarList());

    });
    this.isUserLoggedIn.next(true);
  }

  getNavBarList(){
  return this.http.get(buildNavBarUrl).pipe(map(value => {
      return value;})).subscribe((value) => {
        this.navList["my_timesheets"] = value["my_timesheets"];
        this.navList["approve_timesheets"] = value["approve_timesheets"];
        this.navList["my_team"] = value["my_team"];
        this.navList["manage_projects"] = value["manage_projects"];
        this.navList["manage_teams"] = value["manage_teams"];
        this.navList["manage_unit_types"] = value["manage_unit_types"];
        this.navList["manage_tasks"] = value["manage_tasks"];
        this.navList["manage_user_accounts"] = value["manage_user_accounts"];
        this.navList["create_project"] = value["create_project"];
      return value;});
  }
  async signOut() {
    let auth2 = gapi.auth2.getAuthInstance();

    let promise = new Promise((resolve, reject)=>{
      resolve(auth2.signOut());
    });

    await promise.then(()=>{
      let snackBarRef = this.snackBar.open('Signed out', null, {duration: 2000, politeness: "assertive", });
      return this.signOutOperations();
    });
  }

  signOutOperations() {
    this.setUser(null);
    this.isUserLoggedIn.next(false);
    return this.router.navigate(['/']);
  }

  getToken():string{
    return this.user.getAuthResponse().id_token;
  }

  getIcon():string{
    return this.user.getBasicProfile().getImageUrl();
  }
}
