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
 * @version 1.0
 */
@Injectable({
  providedIn: 'root'
})
export class UserAccountService {

  /** The link used to GET, POST and DELETE user accounts */
  private userAccountUrl = "http://localhost:8080/user_accounts";

  /** The UserAccount selected from the list of UserAccounts.*/
  private selectedUserAccount: UserAccount;

  userAccounts: Observable<Array<UserAccount>>;
  teams: Observable<Array<Team>>;

  constructor(private http: HttpClient, private teamService : TeamService) {
    this.userAccounts = this.GETAllUserAccounts();
    this.teams = teamService.GETAllTeams();

  }

  refreshUserAccounts() {
    this.userAccounts = this.GETAllUserAccounts();
  }



  /**
   * Gets a List of all UserAccounts.
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
    if (userAccount.id === -1) {
      await this.http.post<UserAccount>(this.userAccountUrl, JSON.stringify(userAccount), httpOptions).toPromise().then(response => {
        this.userAccountSidebarService.reloadUserAccounts();

        testUserAccount = response;
        return response;
      }).catch((error: any) => {
        //TODO Add an error display
      });
    } else {
      const url = userAccount._links["update"];
      this.http.put<UserAccount>(url["href"], JSON.stringify(userAccount), httpOptions).toPromise().then(response => {
        this.userAccountSidebarService.reloadUserAccounts();

        testUserAccount = response;
        return response;
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
        this.userAccounts = this.userAccounts.filter( function(userAccount) {
          return userAccount.id !== accountToDelete.id;
        });
        this.userAccountSidebarService.reloadUserAccounts();
      });
  }

  //TODO Unfinished
  cancel(userAccount: UserAccount) {
    (<HTMLInputElement>document.getElementById(""))
  }

  destroyAddUserAccountComponent() {
    this.userAccountSidebarService.destroyAddUserAccountComponent();
  }

}
