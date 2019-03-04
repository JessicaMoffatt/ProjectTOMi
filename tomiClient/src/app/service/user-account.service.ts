import {Injectable} from '@angular/core';
import {UserAccount} from "../model/userAccount";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {BehaviorSubject, Observable} from "rxjs";
import {map} from "rxjs/operators";
import {TeamService} from "./team.service";

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

/**
 * UserAccountService is used to control the flow of data regarding user accounts to/from the view.
 *
 * @author Jessica Moffatt
 * @version 1.1
 */
@Injectable({
  providedIn: 'root'
})
export class UserAccountService {

  /** The link used to GET, POST and DELETE user accounts */
  private userAccountUrl = "http://localhost:8080/user_accounts";

  /** The UserAccount selected from the list of UserAccounts.*/
  private selectedUserAccount: UserAccount;

  /** Listing of all active UserAccounts */
  userAccounts: Observable<Array<UserAccount>>;
  userSubject: BehaviorSubject<Array<UserAccount>>;

  public constructor(private http: HttpClient) {
    this.GETAllUserAccounts().forEach( users => {
      this.userSubject = new BehaviorSubject<Array<UserAccount>>(users);
    });
  }

  /**
   * Refresh the List of UserAccounts to keep up-to-date with the server.
   */
  refreshUserAccounts() {
    let freshUsersObs = this.GETAllUserAccounts();

    // Replace all users with fresh user data
    freshUsersObs.forEach(freshUsers => {
      freshUsers.forEach( freshUser => {

        let index = this.userSubject.getValue().findIndex((staleUser) => {
          return (staleUser.id === freshUser.id);
        });

        // If the id didn't match any of the existing ids then add it to the list.
        if (index === -1) {
          this.userSubject.getValue().push(freshUser);

          // id was found and this UserAccount will be replaced with fresh data
        } else {
          this.userSubject.getValue().splice(index, 1, freshUser);
        }

      });
    });

    // Check for any deleted userAccounts
    this.userSubject.getValue().forEach(staleUser => {

      freshUsersObs.forEach( freshUsers => {
        let index = freshUsers.findIndex((freshUser) => {
          return (freshUser.id === staleUser.id);
        });

        //If the id wasn't found, then the userAccount has been deleted and is removed from the BehaviourSubject list.
        if (index === -1) {
          let indexToBeRemoved = this.userSubject.getValue().findIndex( (userToBeRemoved) => {
            return (userToBeRemoved.id === staleUser.id);
          });

          this.userSubject.getValue().splice(indexToBeRemoved, 1);
        }
      });
    });

  }

  /**
   * Sends a GET message to the server for a fresh list of all UserAccounts.
   */
  GETAllUserAccounts() {
    return this.http.get(this.userAccountUrl).pipe(map((response:Response) => response))
      .pipe(map((data: any) => {
        return data._embedded.userAccounts as UserAccount[];
      }));
  }

  setSelectedUserAccount(userAccount: UserAccount) {
    this.selectedUserAccount = userAccount;
  }

  /**
   * Saves a specified UserAccount. If the UserAccount is new (id = -1), an HTTP POST is performed, else an HTTP PUT is performed to update the existing UserAccount.
   *
   * @param account The UserAccount to be created/updated.
   */
  async save(userAccount: UserAccount) {
    let testUserAccount: UserAccount = null;

    if (userAccount.id === -1) {
      await this.http.post<UserAccount>(this.userAccountUrl, JSON.stringify(userAccount), httpOptions).toPromise().then(response => {

        this.refreshUserAccounts();
      }).catch((error: any) => {
        //TODO Add an error display
      });
    } else {
      const url = userAccount._links["update"];
      this.http.put<UserAccount>(url["href"], JSON.stringify(userAccount), httpOptions).toPromise().then(response => {

        this.refreshUserAccounts();
      }).catch((error: any) => {
        //TODO Add an error display
      });
    }
    return testUserAccount;
  }

  /**
   *  Logically deletes the selected user account (sets the active status to false.)
   *
   * @param account The UserAccount to be deleted.
   */
    delete(accountToDelete:UserAccount) {
      let url = accountToDelete._links["delete"];
      this.http.delete(url["href"], httpOptions).subscribe((response) => {
        this.refreshUserAccounts();
      });
  }

    getUserById(id:number): Observable<UserAccount>{
      return this.http.get(`${this.userAccountUrl}/${id}`).pipe(map((response:Response) => response))
        .pipe(map((data: any) => {
          return data as UserAccount;
        }));
    }
}
