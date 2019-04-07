import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {Router} from "@angular/router";
import {MatSnackBar} from "@angular/material";
import {HttpClient} from "@angular/common/http";
import {catchError, map} from "rxjs/operators";
import {UserAccount} from "../model/userAccount";
import {buildNavBarUrl} from "../configuration/domainConfiguration";
import {ErrorService} from "./error.service";

declare let gapi:any;

/**
 * @author Karol Talbot
 * @version 1.0
 *
 * SignInService is used to control the flow of data regarding navigation and signing in to/from the view.
 */
@Injectable({
  providedIn: 'root'
})
export class SignInService {
  /** The signed in user.*/
  private user:any;

  /** Represents whether or not the user is logged in.*/
  private isUserLoggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  /** The list of locations the user is allowed to navigate to.*/
  public navList:Array<any> = [];

  /** The UserAccount object representing the signed in user.*/
  userAccount:UserAccount;

  constructor(private router:Router, private snackBar:MatSnackBar, private http:HttpClient, private errorService: ErrorService) {
    this.router = router;
    this.snackBar = snackBar;
    this.http = http;
  }

  /** Sets user.*/
  setUser(user:any):boolean{
    this.user = user;
    return true;
  }

  /** Returns the value of isUserLoggedIn.*/
  isLoggedIn(){
    return this.isUserLoggedIn;
  }

  /**
   * After retrieving the navigation bar list, sets isUseLoggedIn to true.
   */
  async setLoggedIn(){
    new Promise((resolve)=>{
      resolve(this.getNavBarList());
    });
    this.isUserLoggedIn.next(true);
  }

  /**
   * Sends a GET message to the server to retrieve the list of navigation the user is allowed to access.
   * navList is populated from through checking the retrieved values from this list.
   */
  getNavBarList(){
  return this.http.get(buildNavBarUrl)
    .pipe(catchError(this.errorService.handleError()))
    .pipe(map(value => {
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

  /**
   * Signs out the user from the application.
   */
  async signOut() {
    let auth2 = gapi.auth2.getAuthInstance();

    let promise = new Promise((resolve)=>{
      resolve(auth2.signOut());
    });

    await promise.then(()=>{
      let snackBarRef = this.snackBar.open('Signed out', null, {duration: 2000, politeness: "assertive", });
      return this.signOutOperations();
    }).catch( ()=> this.errorService.displayError())
  }

  /**
   * Clears user related values and navigates to the main page.
   */
  signOutOperations() {
    this.setUser(null);
    this.isUserLoggedIn.next(false);
    return this.router.navigate(['/']);
  }

  /**
   * Returns the ID token for this user.
   */
  getToken():string{
    return this.user.getAuthResponse().id_token;
  }

  /**
   * Gets the profile icon for this user.
   */
  getIcon():string{
    return this.user.getBasicProfile().getImageUrl();
  }
}
