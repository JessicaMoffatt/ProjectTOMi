import {Injectable} from '@angular/core';
import {UserAccount} from "../model/userAccount";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {BehaviorSubject, Observable} from "rxjs";
import {map} from "rxjs/operators";
import {MatSnackBar} from "@angular/material";
import {Project} from "../model/project";

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
  userSubject: BehaviorSubject<Array<UserAccount>> = new BehaviorSubject<Array<UserAccount>>([]);

  public constructor(private http: HttpClient, public snackBar: MatSnackBar) {

  }

  /**
   * Get the list of all active users and populate into the userSubject list.
   */
  initializeUserAccounts() {
    this.GETAllUserAccounts().forEach(users => {
      this.userSubject = new BehaviorSubject<Array<UserAccount>>(users);
      this.sortUserAccounts();
    }).catch((error: any) => {
      let getUsersErrorMessage = 'Something went wrong when getting the list of users. Please contact your system administrator.';
      this.snackBar.open(getUsersErrorMessage, null, {
        duration: 5000,
        politeness: 'assertive',
        panelClass: 'snackbar-fail',
        horizontalPosition: 'right'
      });
    });
  }

  /**
   * Sorts the user accounts in the userSubject list by ascending last name.
   */
  sortUserAccounts() {
    this.userSubject.getValue().sort((user1, user2) => {
      let name1 = user1.lastName.toLowerCase();
      let name2 = user2.lastName.toLowerCase();
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
   * Refresh the List of UserAccounts to keep up-to-date with the server.
   */
  refreshUserAccounts() {
    let freshUsers: UserAccount[];

    this.GETAllUserAccounts().forEach(users => {
      freshUsers = users;

      //Replace all users with fresh user data
      freshUsers.forEach(freshUser => {
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

      // Check for any deleted userAccounts
      this.userSubject.getValue().forEach(oldUser => {
        let index = freshUsers.findIndex(newUser => {
          return (newUser.id === oldUser.id);
        });

        if (index === -1) {
          let indexToBeRemoved = this.userSubject.getValue().findIndex((userToBeRemoved) => {
            return (userToBeRemoved.id === oldUser.id);
          });

          this.userSubject.getValue().splice(indexToBeRemoved, 1);
        }
      });
    }).then(value => {
      this.sortUserAccounts();
    });
  }

  /**
   * Sends a GET message to the server for a fresh list of all UserAccounts.
   */
  GETAllUserAccounts() {
    let obsUsers: Observable<Array<UserAccount>>;
    obsUsers = this.http.get(this.userAccountUrl).pipe(map((response: Response) => response))
      .pipe(map((data: any) => {
        return data._embedded.userAccounts as UserAccount[];
      }));
    return obsUsers;
  }

  setSelectedUserAccount(userAccount: UserAccount) {
    this.selectedUserAccount = userAccount;
  }

  /**
   * Saves a specified UserAccount. If the UserAccount is new (id = -1), an HTTP POST is performed, else an HTTP PUT is performed to update the existing UserAccount.
   *
   * @param userAccount The UserAccount to be created/updated.
   */
  async save(userAccount: UserAccount) {
    if (userAccount.id === -1) {
      await this.http.post<UserAccount>(this.userAccountUrl, JSON.stringify(userAccount), httpOptions).toPromise().then(response => {
        this.refreshUserAccounts();
        let addUserSuccessMessage = userAccount.firstName + ' ' + userAccount.lastName + ' added successfully.';
        this.snackBar.open(addUserSuccessMessage, null, {
          duration: 4000,
          politeness: 'assertive',
          panelClass: 'snackbar-success',
          horizontalPosition: 'right'
        });
      }).catch((error: any) => {
        let addUserErrorMessage = 'Something went wrong when adding ' + userAccount.firstName + ' ' + userAccount.lastName + '. Please contact your system administrator.';
        this.snackBar.open(addUserErrorMessage, null, {
          duration: 5000,
          politeness: 'assertive',
          panelClass: 'snackbar-fail',
          horizontalPosition: 'right'
        });
      });
    } else {
      const url = userAccount._links["self"];
      await this.http.put<UserAccount>(url["href"], JSON.stringify(userAccount), httpOptions).toPromise().then(response => {
        this.refreshUserAccounts();
        let editUserSuccessMessage = userAccount.firstName + ' ' + userAccount.lastName + ' updated successfully.';
        this.snackBar.open(editUserSuccessMessage, null, {
          duration: 4000,
          politeness: 'assertive',
          panelClass: 'snackbar-success',
          horizontalPosition: 'right'
        });
      }).catch((error: any) => {
        let editUserErrorMessage = 'Something went wrong when updating ' + userAccount.firstName + ' ' + userAccount.lastName + '. Please contact your system administrator.';
        this.snackBar.open(editUserErrorMessage, null, {
          duration: 5000,
          politeness: 'assertive',
          panelClass: 'snackbar-fail',
          horizontalPosition: 'right'
        });
      });
    }
  }

  /**
   * Logically deletes the selected user account (sets the active status to false.)
   *
   * @param account The UserAccount to be deleted.
   */
  delete(userAccount: UserAccount) {
    const url = userAccount._links["self"];
    this.http.delete(url["href"], httpOptions).toPromise().then(response => {
      this.refreshUserAccounts();
      let deleteUserSuccessMessage = userAccount.firstName + ' ' + userAccount.lastName + ' deleted successfully.';
      this.snackBar.open(deleteUserSuccessMessage, null, {
        duration: 4000,
        politeness: 'assertive',
        panelClass: 'snackbar-success',
        horizontalPosition: 'right'
      });
    }).catch((error: any) => {
      let deleteUserErrorMessage = 'Something went wrong when deleting ' + userAccount.firstName + ' ' + userAccount.lastName + '. Please contact your system administrator.';
      this.snackBar.open(deleteUserErrorMessage, null, {
        duration: 5000,
        politeness: 'assertive',
        panelClass: 'snackbar-fail',
        horizontalPosition: 'right'
      });
    });
  }

  /**
   * Get a UserAccount by their id.
   *
   * @param id id of the user.
   */
  getUserById(id: number): Observable<UserAccount> {
    return this.http.get(`${this.userAccountUrl}/${id}`).pipe(map((response: Response) => response))
      .pipe(map((data: any) => {
        return data as UserAccount;
      }));
  }
}



