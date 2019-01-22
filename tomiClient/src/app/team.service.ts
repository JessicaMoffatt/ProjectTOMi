import {ComponentRef, EventEmitter, Injectable, Output} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from "@angular/common/http";
import {Team} from "./team";
import {Observable, ReplaySubject, Subject, throwError} from "rxjs";
import {catchError, map} from "rxjs/operators";
import {Account} from "./account";
import {TeamSidebarService} from "./team-sidebar.service";

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
  private userUrl = `http://localhost:8080/user_accounts`;

  teamMembers: Account[] = new Array();
  allMembers: Account[] = new Array();

  ref:ComponentRef<any>;

  constructor(private http: HttpClient, private teamSideBarService: TeamSidebarService) {
  }

  findAllMembers(): Observable<Array<Account>>{
    return this.http.get(this.userUrl).pipe(map((response:Response) => response))
      .pipe(map((data:any) => {
        return data._embedded.userAccounts as Account[];
      }));
  }

  findTeamMembers(id:number): Observable<Array<Account>>{
    return this.http.get(`${this.teamUrl}/${id}/user_accounts`).pipe(map((response: Response) => response))
      .pipe(map((data: any) => {
        return data._embedded.userAccounts as Account[];
      }));
  }

  findTeamMemberById(id:number): Observable<Account>{
    return this.http.get(`${this.userUrl}/${id}`).pipe(map((response: Response) => response))
      .pipe(map((data: any) => {
        return data as Account;
      }));
  }

  //TODO add error handling!!
  //TODO return something other than null?
  addTeamMember(user_account: Account): Observable<Account>{
    const url = user_account._links["update"];
    this.http.put<Account>(url["href"], JSON.stringify(user_account), httpOptions).subscribe((response)=> {
      return response as Account;
    });

    return null;
  }

  //TODO add error handling!!
  //TODO return something other than null?
  save(team: Team): Observable<Team>{
    if(team.id === -1){
      team.id = null;
      this.http.post<Team>(this.teamUrl, JSON.stringify(team), httpOptions).subscribe((response)=>{
        this.teamSideBarService.teams.push(team);
        this.teamSideBarService.destroyAddTeamComponent();
        return response as Team;
      });
    }else{
      const url = team._links["update"];
      this.http.put<Team>(url["href"], JSON.stringify(team), httpOptions).subscribe((response)=>{
        this.teamSideBarService.reloadTeams();
        return response as Team;
      });
    }
    return null;
  }

  //TODO finish
  cancel(team:Team): void{
    (<HTMLInputElement>document.getElementById("team_name")).value = team.teamName;
  }

  //TODO add error handling!!
  //TODO return something other than null?
  delete(team: Team): Observable<Team>{
    let index = this.teamSideBarService.teams.findIndex((element)=>{
     return (element.id == team.id);
    });

    this.teamSideBarService.teams.splice(index,1);

    const url = team._links["delete"];

    this.http.delete(url["href"], httpOptions).subscribe((response)=> {
      this.teamSideBarService.selectedTeam = null;

      return response as Team;
    });

    return null;
  }

  destroyAddMemberComponent(){
    this.ref.destroy();
  }

}
