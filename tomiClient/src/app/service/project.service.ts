import { Injectable } from '@angular/core';
import {map} from "rxjs/operators";
import {UserAccount} from "../model/userAccount";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {Project} from "../model/project";

const httpOptions ={
  headers: new HttpHeaders({ 'Content-Type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  private projectsUrl = 'http://localhost:8080/projects';

  constructor(private http: HttpClient) { }

  getProjects(id:number): Observable<Array<Project>>{
    return this.http.get(`${this.projectsUrl}`).pipe(map((response: Response) => response))
      .pipe(map((data: any) => {
        if (data._embedded !== undefined) {
          return data._embedded.projects as Project[];
        } else {
          return [];
        }
      }));
  }
}
