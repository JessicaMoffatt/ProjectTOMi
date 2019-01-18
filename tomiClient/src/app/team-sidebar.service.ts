import {ComponentFactoryResolver, Inject, Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {Team} from "./team";
import {map} from "rxjs/operators";
import {HttpClient, HttpHeaders} from "@angular/common/http";

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class TeamSidebarService {
  private teamUrl = `http://localhost:8080/teams/`;

  constructor(private http: HttpClient) {
  }


  findAllTeams(): Observable<Array<Team>>{
    return this.http.get(this.teamUrl).pipe(map((response: Response) => response))
      .pipe(map((data: any) => {
        return data._embedded.teams as Team[];
      }));
  }



}
