import { Injectable } from '@angular/core';
import {map} from "rxjs/operators";
import {UserAccount} from "../model/userAccount";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {Project} from "../model/project";

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  private projectsUrl = 'http://localhost:8080/projects';
  private userAccountProjectsUrl = 'http://localhost:8080/user_accounts/';

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

  getProjectsForUser(userId:number): Observable<Array<Project>>{
    return this.http.get(`${this.userAccountProjectsUrl}/${userId}/projects`).pipe(map((response: Response) => response))
      .pipe(map((data: any) => {
        if (data._embedded !== undefined) {
          return data._embedded.projects as Project[];
        } else {
          return [];
        }
      }));
  }

   getProjectById(id:number){
     return this.http.get(`${this.projectsUrl}/${id}`).pipe(map((response: Response) => response))
      .pipe(map((data: any) => {
        if (data !== undefined) {
          return data as Project;
        } else {
          return null;
        }
      }));
  }
}
