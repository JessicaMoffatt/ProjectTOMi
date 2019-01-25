import {Injectable} from '@angular/core';
import {UserAccount} from "../model/userAccount";
import {HttpClient, HttpHeaders} from "@angular/common/http";

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

  constructor(private http: HttpClient) {
  }

  /**
   * Updates a given user account through a put method to the backend.
   *
   * @param account The user account to be updated.
   */
  save(account: UserAccount) {
    const url = account._links["update"];

    let teamAccount: UserAccount = null;

    this.http.put<UserAccount>(url["href"], JSON.stringify(account), httpOptions).subscribe((response) => {
      teamAccount = response;

      return response;
    });
  }
}
