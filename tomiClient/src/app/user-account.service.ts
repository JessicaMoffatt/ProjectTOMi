import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {Account} from "./account";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {TeamService} from "./team.service";

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class UserAccountService {

  constructor(private http: HttpClient, private teamService: TeamService) { }

  //TODO fix return null
  save(account: Account): Observable<Account>{
      const url = account._links["update"];
      this.http.put<Account>(url["href"], JSON.stringify(account), httpOptions).subscribe((response)=>{

        // this.teamService.teamMembers.push(account);
        return response as Account;
        console.log(response);
      });
    console.log(account);
    return null;
  }
}
