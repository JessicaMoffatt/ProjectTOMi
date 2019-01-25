import {ComponentRef, Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {Team} from "../model/team";
import {map} from "rxjs/operators";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class TeamSidebarService {
  private teamUrl = `http://localhost:8080/teams/`;

  ref:ComponentRef<any>;

  selectedTeam: Team;
  teams: Team[];

  constructor(private http: HttpClient) {
  }

  reloadTeams(){
    this.findAllTeams().subscribe((data: Array<Team>) => {
      this.teams = data;
    });
  }

  destroyAddTeamComponent(){
    this.ref.destroy();
  }

  findAllTeams(): Observable<Array<Team>>{
    return this.http.get(this.teamUrl).pipe(map((response: Response) => response))
      .pipe(map((data: any) => {
        return data._embedded.teams as Team[];
      }));
  }

  findTeamById(id:number): Observable<Team>{
    return this.http.get(`${this.teamUrl}/${id}`).pipe(map((response: Response) => response))
      .pipe(map((data:any) => {
        return data as Team;
      }));
  }
}
