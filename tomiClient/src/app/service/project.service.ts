import { Injectable } from '@angular/core';
import {map} from "rxjs/operators";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Project} from "../model/project";

/**
 * Project service provides services relates to Projects.
 * @author Jessica Moffatt
 * @version 1.0
 */
@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  /** The URL for accessing projects.*/
  private projectsUrl = 'http://localhost:8080/projects';
  /** The URL for accessing user accounts.*/
  private userAccountProjectsUrl = 'http://localhost:8080/user_accounts/';

  /** tracks which project is selected in project-panel component and manage-project modal */
  selected: Project; // added by: James Andrade

  /** used to pass list to project related components */
  projects: Observable<Array<Project>>; // added by: James Andrade

  constructor(private http: HttpClient) {
    this.projects = this.getProjects(); // added by: James Andrade
  }

  /**
   * Gets all projects.
   */
  getProjects(): Observable<Array<Project>>{
    return this.http.get(`${this.projectsUrl}`).pipe(map((response: Response) => response))
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
    return this.http.get(`${this.userAccountProjectsUrl}/${userId}/projects`).pipe(map((response: Response) => response))
      .pipe(map((data: any) => {
        if (data._embedded !== undefined) {
          return data._embedded.projects as Project[];
        } else {
          return [];
        }
      }));
  }

  /**
   * sets the selected project that will be used in project-panel and manage-projects component
   * added by: James Andrade
   * @param project the project to be stored as 'selected'
   */
  setSelected(project: Project){
    this.selected = project;
  }


  /**
   * Gets a project with the specified ID.
   * @param id The ID of the project to get.
   */
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
