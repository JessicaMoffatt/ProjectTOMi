import {Injectable} from '@angular/core';
import {map} from "rxjs/operators";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {BehaviorSubject, Observable} from "rxjs";
import {catchError} from "rxjs/operators";
import {HttpErrorResponse} from "@angular/common/http";
import {throwError} from "rxjs";
import {Project} from "../model/project";
import {projectsUrl} from "../configuration/domainConfiguration";
import {dataDumpUrl} from "../configuration/domainConfiguration";
import {userAccountUrl} from "../configuration/domainConfiguration";
import {UserAccount} from "../model/userAccount";
import {MatSnackBar} from "@angular/material";
import {ExpenseService} from "./expense.service";

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

/**
 * Project service provides services relates to Projects.
 * @author Jessica Moffatt
 * @version 1.0
 */
@Injectable({
  providedIn: 'root'
})
export class ProjectService {

    /** tracks which project is selectedProject in project-panel component and manage-project modal.
   */
  selectedProject: Project; // added by: James Andrade

  /** used to pass list to project related components */
  projects: BehaviorSubject<Array<Project>> = new BehaviorSubject([]); // added by: James Andrade

  /** the user accounts assigned to the current project; for display in project-member-list-component */
  userAccountList: BehaviorSubject<Array<UserAccount>> = new BehaviorSubject([]);

  constructor(private http: HttpClient, public snackBar: MatSnackBar, private expenseService: ExpenseService) {
  }

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
   * sets the selectedProject project that will be used in project-panel and manage-projects component
   * added by: James Andrade
   * @param project the project to be stored as 'selectedProject'
   */
  setSelected(project: Project) {
    this.selectedProject = project;
    this.refreshUserAccountList();
    this.expenseService.refreshExpenses(this.selectedProject);
    // console.log("selectedProject:"+project.projectName);
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
   */
  getDataDump(){
    return this.http.get(`${dataDumpUrl}`, {responseType: 'blob'})
      .pipe(
        map((res) => {return res}),catchError(ProjectService.handleError)
      );
  }

  /**
   * General error handling method.
   * @param error The error that occurred.
   */
  private static handleError(error: HttpErrorResponse) {
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

      this.http.post<Project>(`${projectsUrl}`, JSON.stringify(project))
        .toPromise()
        .then((project)=> this.selectedProject = project);

      console.log('in project.service.ts -- at end point of save')
        //.catch((error: any) => {
        //TODO Add an error display
      //});
    } else {
      const url = project._links["update"];
      this.http.put<UserAccount>(url["href"], JSON.stringify(project)).toPromise().then(() => {

        //  this.refreshClients();
      }).catch(() => {
        //TODO Add an error display
      });
    }
  }


  addUser(userAccountId: number) {
    this.http.put<UserAccount>(`${projectsUrl}/${this.selectedProject.id}/add_member/${userAccountId}`, httpOptions).toPromise()
      .then((response) => {
      this.refreshUserAccountList();
      return response;
    }).catch(() => {
      return null;
    });
  }


  initializeProjects() {
    this.getAllProjects().forEach(project => {
      this.projects = new BehaviorSubject<Array<Project>>(project);
      // this.sort();
    }).catch(() => {
      let getUsersErrorMessage = 'Something went wrong when getting the list of projects. Please contact your system administrator.';
      this.snackBar.open(getUsersErrorMessage, null, {
        duration: 5000,
        politeness: 'assertive',
        panelClass: 'snackbar-fail',
        horizontalPosition: 'right'
      });
    });
  }


  refreshUserAccountList() {
    this.http.get(`${projectsUrl}/${this.selectedProject.id}/members`)
      .pipe(map((data: any) => {
        if (data !== undefined) {
          return data as UserAccount[];
        } else {
          return [];
        }
      })).forEach(userAccount => {
      this.userAccountList = new BehaviorSubject<Array<UserAccount>>(userAccount);
    }).catch(() => {
      let getUsersErrorMessage = 'Something went wrong when getting the list of project members. Please contact your system administrator.';
      this.snackBar.open(getUsersErrorMessage, null, {
        duration: 5000,
        politeness: 'assertive',
        panelClass: 'snackbar-fail',
        horizontalPosition: 'right'
      });
    });
  }

  removeUser(userId: number) {
    this.http.put(`${projectsUrl}/${this.selectedProject.id}/remove_member/${userId}`, httpOptions).toPromise()
      .then( () => this.refreshUserAccountList())
  }
}
