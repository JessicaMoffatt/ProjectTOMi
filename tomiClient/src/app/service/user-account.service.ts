import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {Account} from "../model/account";
import {HttpClient, HttpHeaders} from "@angular/common/http";

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class UserAccountService {

  constructor(private http: HttpClient) { }

  //TODO fix return null
  save(account: Account): Observable<Account>{
      const url = account._links["update"];
      this.http.put<Account>(url["href"], JSON.stringify(account), httpOptions).subscribe((response)=>{

        return response as Account;
      });
    return null;
  }
}
