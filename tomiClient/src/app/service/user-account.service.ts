import {Injectable} from '@angular/core';
import {UserAccount} from "../model/userAccount";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {BehaviorSubject, Observable} from "rxjs";
import {catchError, map} from "rxjs/operators";
import {MatSnackBar} from "@angular/material";
import {userAccountUrl} from "../configuration/domainConfiguration";
import {ErrorService} from "./error.service";
import {SignInService} from "./sign-in.service";

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

/**
 * UserAccountService is used to control the flow of data regarding user accounts to/from the view.
 *
 * @author Jessica Moffatt, Iliya Kiritchkov
 * @version 1.1
 */
@Injectable({
  providedIn: 'root'
})
export class UserAccountService {
  /** The UserAccount selected from the list of UserAccounts.*/
  private selectedUserAccount: UserAccount;

  /** Listing of all active UserAccounts */
  userAccounts: Observable<Array<UserAccount>>;

  /** The list of all active UserAccounts. */
  userSubject: BehaviorSubject<Array<UserAccount>> = new BehaviorSubject<Array<UserAccount>>([]);

  public constructor(private http: HttpClient, public snackBar:MatSnackBar, private errorService: ErrorService, private signInService:SignInService) {

  }

  /**
   * Gets the list of all active users and populates them into the userSubject list.
   */
  initializeUserAccounts() {
    this.GETAllUserAccounts().forEach(users => {
      this.userSubject = new BehaviorSubject<Array<UserAccount>>(users);
      this.sortUserAccounts(this.userSubject);
    }).catch( () => this.errorService.displayError());
  }

  /**
   * Sorts the UserAccounts in the userSubject list by ascending last name.
   */
  sortUserAccounts(users: BehaviorSubject<Array<UserAccount>>) {
    users.getValue().sort((user1, user2) => {
      let name1 = user1.lastName.toLowerCase() + user1.firstName.toLowerCase();
      let name2 = user2.lastName.toLowerCase() + user2.firstName.toLowerCase();
      if (name1 > name2) {
        return 1;
      }
      if (name1 < name2) {
        return -1;
      }
      return 0;
    });
  }

  /**
   * Sends a GET message to the server for a fresh list of all UserAccounts.
   */
  GETAllUserAccounts() {
    let obsUsers : Observable<Array<UserAccount>>;
    obsUsers = this.http.get(userAccountUrl)
      .pipe(catchError(this.errorService.handleError()))
      .pipe(map((data: any) => {
        return data._embedded.userAccounts as UserAccount[];
      }));
    return obsUsers;
  }

  /**
   * Saves the specified UserAccount. If the UserAccount is new (id = -1), an HTTP POST is performed,
   * else an HTTP PUT is performed to update the existing UserAccount.
   *
   * @param userAccount The UserAccount to be created/updated.
   */
  async save(userAccount: UserAccount) {
    if (userAccount.id === -1) {
      await this.http.post<UserAccount>(userAccountUrl, JSON.stringify(userAccount), httpOptions).toPromise()
        .then(() => {
          this.initializeUserAccounts();
      }).catch(() => {
        this.errorService.displayErrorMessage('Something went wrong when adding ' + userAccount.firstName + ' '
          + userAccount.lastName + '.');
      });
    } else {
      const url = userAccount._links["update"];
      await this.http.put<UserAccount>(url["href"], JSON.stringify(userAccount), httpOptions).toPromise().then(() => {
        this.initializeUserAccounts();
      }).catch(() => {
        this.errorService.displayErrorMessage('Something went wrong when updating ' + userAccount.firstName + ' '
          + userAccount.lastName + '.')
      });
    }
    this.signInService.getNavBarList();
  }

  /**
   * Logically deletes the selected UserAccount (sets the active status to false.)
   *
   * @param userAccount The UserAccount to be deleted.
   */
    delete(userAccount: UserAccount) {
      const url = userAccount._links["delete"];
      this.http.delete(url["href"], httpOptions).toPromise().then( () => {
        this.initializeUserAccounts();
      }).catch(() => this.errorService.displayErrorMessage('Something went wrong when deleting '
        + userAccount.firstName + ' '
          + userAccount.lastName + '.')
      );
  }

  /**
   * Sends a GET message to the server to retrieve the UserAccount by their ID.
   *
   * @param id ID of the UserAccount.
   */
  getUserById(id:number): Observable<UserAccount>{
    return this.http.get(`${userAccountUrl}/${id}`)
      .pipe(catchError(this.errorService.handleError()))
      .pipe(map((data: any) => {
        return data as UserAccount;
      }));
  }
}
