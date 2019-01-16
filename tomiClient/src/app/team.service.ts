import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Team} from "./team";
import {Observable} from "rxjs";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class TeamService{

  private endpoint = `http://localhost:8080/teams/`;

  tea : Team;

  constructor(
    private http: HttpClient) {
  }

  findAllTeams(): Observable<Array<Team>>{
    return this.http.get(this.endpoint).pipe(map((response: Response) => response))
      .pipe(map((data: any) => {
        return data._embedded.teams as Team[];
      }));
  }

  findTeamById(id:number): Observable<Team>{
    const url = `http://localhost:8080/teams/7`;

    return this.http.get(url).pipe(map((response: Response) => response))
      .pipe(map((data:any) => {
        this.tea = new Team();
        this.tea.teamName = "Hello";
        this.tea.active = true;
         // this.tea.teamName = data.teamName;
         // this.tea.active = data.active;
         // this.tea = data as Team ;

         console.log(this.tea);
         return this.tea;

        // return data as Team;
      }));
  }
}
