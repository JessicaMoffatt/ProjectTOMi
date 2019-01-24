import {ComponentRef, EventEmitter, Injectable, Output} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from "@angular/common/http";
import {Team} from "./team";
import {Observable, ReplaySubject, Subject, throwError} from "rxjs";
import {catchError, map} from "rxjs/operators";
import {Account} from "./account";
import {TeamSidebarService} from "./team-sidebar.service";
import {UserAccountService} from "./user-account.service";
import {forEach} from "@angular/router/src/utils/collection";

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
  allOutsideMembers: Account[] = new Array();

  private selectedMember: Account;
  ref:ComponentRef<any>;

  constructor(private http: HttpClient, private teamSideBarService: TeamSidebarService, private userAccountService: UserAccountService) {
  }

  setSelectMember(account: Account){
    this.selectedMember = account;
  }

  removeMember(){
    let index = this.teamMembers.findIndex((element)=>{
      return (element.id == this.selectedMember.id);
    });

    this.teamMembers.splice(index,1);

    this.selectedMember.teamId = -1;

    this.userAccountService.save(this.selectedMember);

    this.selectedMember = null;
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
        if(data._embedded !== undefined){
          return data._embedded.userAccounts as Account[];
        }else{
          let emptyList = new Array();
          return emptyList;
        }
      }));
  }

  //TODO finish
  findAllOutsideMembers(id:number): Account[]{
    let temp: Account[];
    this.allMembers.forEach(function(value){
      console.log(this.teamSidebarService.selectedTeam);
      // if(value.teamId !== this.teamSidebarService.selectedTeam.id){
      //   temp.push(value);
      // }
    });

    return temp;
  }

  findTeamMemberById(id:number): Observable<Account>{
    return this.http.get(`${this.userUrl}/${id}`).pipe(map((response: Response) => response))
      .pipe(map((data: any) => {
        return data as Account;
      }));
  }

  //TODO add error handling!!
  //TODO return something other than null?
  save(team: Team): Observable<Team>{
    if(team.id === -1){
            this.http.post<Team>(this.teamUrl, JSON.stringify(team), httpOptions).subscribe((response)=>{
              this.teamSideBarService.teams.push(team);
              this.teamSideBarService.destroyAddTeamComponent();
              return response;
            });
    }else{
      const url = team._links["update"];
      this.http.put<Team>(url["href"], JSON.stringify(team), httpOptions).subscribe((response)=>{
        this.teamSideBarService.reloadTeams();
        return response;
      });
    }
  }

  //TODO finish
  cancel(team:Team): void{
    (<HTMLInputElement>document.getElementById("team_name")).value = team.teamName;
    (<HTMLInputElement>document.getElementById("selected_team_lead")).value = team.leadId.toString();
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
      this.teamMembers = new Array();

      return response as Team;
    });

    return null;
  }

  destroyAddMemberComponent(){
    this.ref.destroy();
  }

}
