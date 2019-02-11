import {ComponentRef, Injectable} from '@angular/core';
import {UserAccount} from "../model/userAccount";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";
import {UserAccountService} from "./user-account.service";

@Injectable({
  providedIn: 'root'
})
export class UserAccountSidebarService {

  /**
   * The link used to GET, POST and DELETE users.
   */
  private userURL = `http://localhost:8080/user_accounts/`;

  /** Used to reference the Add User component created by click the Add User button. */
  ref: ComponentRef<any>;

  /** The selected UserAccount in the sidebar. */
  selectedUserAccount: UserAccount;

  /** List of all UserAccounts for search filtering*/
  filteredUserAccounts: UserAccount[] = [];
  private userAccounts: UserAccount[] = [];

  constructor(private http:HttpClient, public userAccountService: UserAccountService) {
    this.userAccountService.GETAllUserAccounts().subscribe( (users : Array<UserAccount>) => {
      users.forEach( user => {
          this.userAccounts.push(user);
        })
      });

    this.refreshFilteredAccounts("");
  }

  refreshFilteredAccounts(search) {
    console.log(this.filteredUserAccounts);
    this.filteredUserAccounts = this.userAccounts.filter(function (userAccount) {
      return (userAccount.firstName + " " + userAccount.lastName).toUpperCase().includes(search);
    });
  }

  getUserAccountById(id: number): Observable<UserAccount> {
    return this.http.get(`${this.userURL}/${id}`).pipe(map ((response: Response) => response))
      .pipe(map((data: any) => {
        return data as UserAccount;
      }));
  }

  destroyAddUserAccountComponent() {
    this.ref.destroy();
  }
}
