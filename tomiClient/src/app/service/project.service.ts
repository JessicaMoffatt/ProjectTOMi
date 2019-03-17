import { Injectable } from '@angular/core';
import {map} from "rxjs/operators";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {BehaviorSubject, Observable} from "rxjs";
import {catchError} from "rxjs/operators";
import {HttpErrorResponse} from "@angular/common/http";
import {throwError} from "rxjs";
import {Project} from "../model/project";
import {Client} from "../model/client";
import {UserAccount} from "../model/userAccount";
import {MatSnackBar} from "@angular/material";
import {Entry} from "../model/entry";

/**
 * Project service provides services relates to Projects.
 * @author Jessica Moffatt
 * @version 1.0
 */


const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  //TODO don't hardcode this
  userId = 1;


  /** The URL for accessing projects.*/
  private projectsUrl = 'http://localhost:8080/projects';

  private dataDumpUrl = 'http://localhost:8080/data_dump_report/xls';

  /** The URL for accessing user accounts.*/
  private userAccountProjectsUrl = 'http://localhost:8080/user_accounts';

  /** tracks which project is selected in project-panel component and manage-project modal.
   */
  selected: Project; // added by: James Andrade

  /** used to pass list to project related components */
  projects: BehaviorSubject<Array<Project>> = new BehaviorSubject([]); // added by: James Andrade

  /** used to store the members assigned to a project */
  memberList: BehaviorSubject<Array<Project>> = new BehaviorSubject([]);

  constructor(private http: HttpClient, public snackBar:MatSnackBar) {
  }

  /**
   * Gets all projects.
   */
  getAllProjects(): Observable<Array<Project>>{
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
    // console.log("selected:"+project.projectName);
    // console.log("is null:"+project == null);
    // console.log("is undefined:"+project == undefined);
    // console.log("is not null:"+project != null);
    // console.log("is not undefined:"+project != undefined);
  }


  /**
   * Gets a project with the specified ID.
   * @param id The ID of the project to get.
   */
   getProjectById(id:string){
     return this.http.get(`${this.projectsUrl}/${id}`).pipe(map((response: Response) => response))
      .pipe(map((data: any) => {
        if (data !== undefined) {
          return data as Project;
        } else {
          return null;
        }
      }));
  }

  /**
   *
   * @param project The project to get a report for.
   */
  getDataDump(){
    return this.http.get(`${this.dataDumpUrl}`, {responseType: 'blob'})
      .pipe(
        map((res) => {return res}),catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse) {
    return throwError(error.message);
  }


  // @ts-ignore
  async projectNameIsAvailable(projectName: string): boolean {

    this.projects.subscribe(projects => {
        for (let c of projects) {
          if (c.projectName === projectName) {
            return false;
          }
        }
        return true;
      }
    );
  }

  async save(project: Project) {
    if (project.id.length == 2) {
      await this.http.post<Project>(this.projectsUrl, JSON.stringify(project), httpOptions).toPromise().then(response => {

        // this.refreshClients();
      }).catch((error: any) => {
        //TODO Add an error display
      });
    } else {
      const url = project._links["update"];
      this.http.put<UserAccount>(url["href"], JSON.stringify(project), httpOptions).toPromise().then(response => {

        //  this.refreshClients();
      }).catch((error: any) => {
        //TODO Add an error display
      });
    }
  }

  initializeProjects() {
    this.getProjectsForUser(this.userId).forEach( project => {
      this.projects = new BehaviorSubject<Array<Project>>(project);
      // this.sort();
    }).catch( (error: any) => {
      let getUsersErrorMessage = 'Something went wrong when getting the list of projects. Please contact your system administrator.';
      this.snackBar.open(getUsersErrorMessage, null, {duration: 5000, politeness: 'assertive', panelClass: 'snackbar-fail', horizontalPosition: 'right'});
    });
  }

  async addUser(userAccountId: number) {
    console.log("in project.service.ts -- saving user");
    let tempAccount: UserAccount = null;
    await this.http.put<UserAccount>(`${this.projectsUrl}/${this.selected.id}/add_member/${userAccountId}`, httpOptions).toPromise().then((response) => {

   //   tempAccount = response;
      return response;
    }).catch(() => {
      return null;
    });

  return tempAccount;
  }
}
