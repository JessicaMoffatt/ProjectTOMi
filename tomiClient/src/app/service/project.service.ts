import { Injectable } from '@angular/core';
import {catchError, map} from "rxjs/operators";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {Observable, throwError} from "rxjs";
import {Project} from "../model/project";
import {projectsUrl} from "../configuration/domainConfiguration";
import {dataDumpUrl} from "../configuration/domainConfiguration";
import {userAccountUrl} from "../configuration/domainConfiguration";

/**
 * Project service provides services relates to Projects.
 * @author Jessica Moffatt
 * @version 1.0
 */
@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  constructor(private http: HttpClient) { }

  /**
   * Gets all projects.
   */
  getAllProjects(): Observable<Array<Project>>{
    return this.http.get(`${projectsUrl}`).pipe(map((response: Response) => response))
      .pipe(map((data: any) => {
        if (data._embedded !== undefined) {
          return data._embedded.projects as Project[];
        } else {
          return [];
        }
      }));
  }

  /**
   * Gets the projects for a specified user.
   * @param userId The ID of the user whose projects we want.
   */
  getProjectsForUser(userId:number): Observable<Array<Project>>{
    return this.http.get(`${userAccountUrl}/${userId}/projects`).pipe(map((response: Response) => response))
      .pipe(map((data: any) => {
        if (data._embedded !== undefined) {
          return data._embedded.projects as Project[];
        } else {
          return [];
        }
      }));
  }

  /**
   * Gets a project with the specified ID.
   * @param id The ID of the project to get.
   */
   getProjectById(id:string){
     return this.http.get(`${projectsUrl}/${id}`).pipe(map((response: Response) => response))
      .pipe(map((data: any) => {
        if (data !== undefined) {
          return data as Project;
        } else {
          return null;
        }
      }));
  }

  /**
   * Retrieves the data dump report as an xls file download.
   * @param project The project to get a report for.
   */
  getDataDump(){
    return this.http.get(`${dataDumpUrl}`, {responseType: 'blob'})
      .pipe(
        map((res) => {return res}),catchError(this.handleError)
      );
  }

  /**
   * General error handling method.
   * @param error The error that occurred.
   */
  private handleError(error: HttpErrorResponse) {
    return throwError(error.message);
  }
}
