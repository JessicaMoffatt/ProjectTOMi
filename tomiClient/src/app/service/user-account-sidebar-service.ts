import {ComponentRef, Injectable} from '@angular/core';
import {UserAccount} from "../model/userAccount";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";
import {userAccountUrl} from "../configuration/domainConfiguration";

@Injectable({
  providedIn: 'root'
})
export class UserAccountSidebarService {

  /** Used to reference the Add User component created by click the Add User button. */
  ref: ComponentRef<any>;

  /** The selectedProject UserAccount in the sidebar. */
  selectedUserAccount: UserAccount;

  constructor(private http:HttpClient) {

  }

  getUserAccountById(id: number): Observable<UserAccount> {
    return this.http.get(`${userAccountUrl}/${id}`).pipe(map ((response: Response) => response))
      .pipe(map((data: any) => {
        return data as UserAccount;
      }));
  }

  destroyAddUserAccountComponent() {
    this.ref.destroy();
  }
}
