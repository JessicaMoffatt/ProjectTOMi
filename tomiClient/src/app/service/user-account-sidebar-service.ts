import {ComponentRef, Injectable} from '@angular/core';
import {UserAccount} from "../model/userAccount";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";

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

  /** List of all UserAccounts */
  userAccounts: UserAccount[];

  constructor(private http:HttpClient) { }

  /**
   * Gets a List of all UserAccounts.
   */
  getAllUserAccounts(): Observable<Array<UserAccount>> {
    return this.http.get(this.userURL).pipe(map((response:Response) => response))
      .pipe(map((data: any) => {
        return data._embedded.userAccounts as UserAccount[];
    }));
  }

  getUserAccountById(id: number): Observable<UserAccount> {
    return this.http.get(`${this.userURL}/${id}`).pipe(map ((response: Response) => response))
      .pipe(map((data: any) => {
        return data as UserAccount;
      }));
  }

  /**
   * Reassigns the List of UserAccounts to reflect changes made in the database.
   */
  reloadUserAccounts() {
    this.getAllUserAccounts().subscribe((data: Array<UserAccount>) => {
      this.userAccounts = data;
    });
  }
}
