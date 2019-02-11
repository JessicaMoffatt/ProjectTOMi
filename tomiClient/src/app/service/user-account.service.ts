import {Injectable} from '@angular/core';
import {UserAccount} from "../model/userAccount";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {UserAccountSidebarService} from "./user-account-sidebar-service";
import {Team} from "../model/team";
import {TeamSidebarService} from "./team-sidebar.service";
import {Observable} from "rxjs";
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

  public constructor(private http: HttpClient, private teamService : TeamService) {
    this.userAccounts = this.GETAllUserAccounts();
  }

  /**
   * Refresh the List of UserAccounts to keep up-to-date with the server.
   */
  refreshUserAccounts() {
    this.userAccounts = this.GETAllUserAccounts();
  }

  /**
   * Sends a GET message to the server for a list of all UserAccounts.
   */
  GETAllUserAccounts(): Observable<Array<UserAccount>> {
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
    console.log("saving...")
    if (userAccount.id === -1) {
      await this.http.post<UserAccount>(this.userAccountUrl, JSON.stringify(userAccount), httpOptions).toPromise().then(response => {

        testUserAccount = response;
        return response;
      }).catch((error: any) => {
        //TODO Add an error display
      });
    } else {
      const url = userAccount._links["update"];
      this.http.put<UserAccount>(url["href"], JSON.stringify(userAccount), httpOptions).toPromise().then(response => {

        testUserAccount = response;
        return response;
      }).catch((error: any) => {
        //TODO Add an error display
      });
    }
    this.refreshUserAccounts();

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

  //TODO Unfinished
  cancel(userAccount: UserAccount) {
    (<HTMLInputElement>document.getElementById(""))
  }

}
