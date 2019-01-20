import {EventEmitter, Injectable, Output} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from "@angular/common/http";
import {Team} from "./team";
import {Observable, ReplaySubject, Subject, throwError} from "rxjs";
import {catchError, map} from "rxjs/operators";
import {Account} from "./account";

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class TeamService{
  private teamUrl = `http://localhost:8080/teams`;

  teamMembers: Account[] = new Array();

  private teamsSource = new Subject<Team[]>();
  teamsSource$ = this.teamsSource.asObservable();

  announceReload(teams: Team[]){
    this.teamsSource.next(teams);
  }

  constructor(private http: HttpClient) {
  }


  findTeamMembers(id:number): Observable<Array<Account>>{
    return this.http.get(`${this.teamUrl}/${id}/user_accounts`).pipe(map((response: Response) => response))
      .pipe(map((data: any) => {
        return data._embedded.userAccounts as Account[];
      }));
  }

  //TODO add error handling!!
  //TODO add Post if -1!
  //TODO return something other than null?
  save(team: Team): Observable<Team>{
    if(team.id === -1){
      this.http.post<Team>(this.teamUrl, JSON.stringify(team), httpOptions).subscribe((response)=>{
        return response as Team;
      });
    }else{
      const url = team._links["update"];
      this.http.put<Team>(url["href"], JSON.stringify(team), httpOptions).subscribe((response)=>{
        return response as Team;
      });
    }
    return null;
  }

}
