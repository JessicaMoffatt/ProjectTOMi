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

  constructor(
    private http: HttpClient) {
  }

  findAllTeams(): Observable<Array<Team>>{
    return this.http.get(this.endpoint).pipe(map((response: Response) => response))
      .pipe(map((data: any) => {
        return data._embedded.teams as Team[];
      }));
  }
}
