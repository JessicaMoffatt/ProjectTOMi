import {Injectable} from '@angular/core';
import {map} from "rxjs/operators";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {BehaviorSubject, Observable} from "rxjs";
import {catchError} from "rxjs/operators";
import {HttpErrorResponse} from "@angular/common/http";
import {throwError} from "rxjs";
import {Project} from "../model/project";
import {projectsUrl, teamUrl} from "../configuration/domainConfiguration";
import {dataDumpUrl} from "../configuration/domainConfiguration";
import {userAccountUrl} from "../configuration/domainConfiguration";
import {BudgetReport} from "../model/budgetReport";
import {billableUrl} from "../configuration/domainConfiguration";
import {BillableHoursReportLine} from "../model/billableHoursReportLine";
import {ProductivityReportLine} from "../model/productivityReportLine";
import {UserAccount} from "../model/userAccount";
import {MatSnackBar} from "@angular/material";
import {ExpenseService} from "./expense.service";
import {Entry} from "../model/entry";
import {Team} from "../model/team";
import {UnitType} from "../model/unitType";

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

  selectedBudget: BudgetReport;

  billableReport: BillableHoursReportLine[] = [];

  /** The actual hours spent working on a project.*/
  percentActual:number = 0;

  /** The percent of budgeted hours remaining.*/
  percentRemaining:number = 0;

  /** general expression used to check if projectId is valid */
  public readonly regExp: string = "[A-Z]{2}[0-9]{4}";

  /** tracks which project is selectedProject in project-panel component and manage-project modal.
   */
  private selectedProject: Project = new Project(); // added by: James Andrade

  /** used to pass list to project related components */
  projects: BehaviorSubject<Array<Project>> = new BehaviorSubject([]); // added by: James Andrade

  /** the user accounts assigned to the current project; for display in project-member-list-component */
  userAccountList: BehaviorSubject<Array<UserAccount>> = new BehaviorSubject([]);

  constructor(private http: HttpClient, public snackBar: MatSnackBar, private expenseService: ExpenseService) {
  }

  initializeProjects(){
    this.requestAllProjects().forEach(projects => {
      this.projects = new BehaviorSubject<Array<Project>>(projects);
    }).catch((error: any) => {
      console.log("Project error " + error);
    });
  }

  public requestAllProjects() {
    let obsProjects: Observable<Array<Project>>;
    obsProjects = this.http.get(`${projectsUrl}`)
      .pipe(map((data: any) => {
        return data._embedded.projects as Project[];
      }));
    return obsProjects;
  }

  /**
   * Gets the projects for a specified user.
   * @param userId The ID of the user whose projects we want.
   */
  getProjectsForUser(userId: number): Observable<Array<Project>> {
    return this.http.get(`${userAccountUrl}/${userId}/projects`)
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
   * @author James Andrade
   * @author Jessica Moffatt
   * @param project the project to be stored as 'selectedProject'
   */
  async setSelected(project: Project) {
    this.selectedProject = await project;
    this.refreshProjectList()
    if (this.selectedProject != null && this.selectedProject.id.match(this.regExp)) {
      this.refreshUserAccountList();
      this.expenseService.refreshExpenses(this.selectedProject);
      this.getBudgetReportByProjectId(project)
      .subscribe(
        data => {
          this.selectedBudget = data;
          this.percentActual = this.calculatePercentActual();
          this.percentRemaining = 100- this.percentActual;
        },
        error => {
          this.handleError
        });
    this.getBillableReport().subscribe(data=>{
      this.billableReport = data;
      this.billableReport.sort(BillableHoursReportLine.compareName);
    }, error =>{
        this.handleError
    });
    }
  }

  getSelectedProject() {
    return this.selectedProject;
  }

  /**
   * Gets a project with the specified ID.
   * @param id The ID of the project to get.
   */
  getProjectById(id:string){
    return this.http.get(`${projectsUrl}/${id}`)
      .pipe(
        map((res:Project) => {return res}),catchError(this.handleError)
      );
  }

  /**
   *
   * @param project The project to get a report for.
   */
  getBudgetReportByProjectId(project:Project){
    let url = project._links["budget"];
    return this.http.get(`${url["href"]}`)
      .pipe(
        map((res:BudgetReport) => {return res}),catchError(this.handleError)
      );
  }

  calculatePercentBillable():string{
    if(this.selectedBudget){
      let percent = this.selectedBudget.billableHours/this.selectedBudget.totalHours*100;
      let percentString = percent.toFixed(2);

      return percentString;
    }else{
      return "0";
    }
  }

  calculatePercentActual():number{
    if(this.selectedBudget){
      return this.selectedBudget.totalHours/this.selectedBudget.project.budgetedHours*100;
    }else{
      return 0;
    }
  }

  getBillableReport(){
    return this.http.get(billableUrl)
      .pipe(
        map((res:BillableHoursReportLine[]) => {return res}),catchError(this.handleError)
      );
  }


  /**
   * Retrieves the data dump report as an xls file download.
   */
  getDataDump() {
    return this.http.get(`${dataDumpUrl}`, {responseType: 'blob'})
      .pipe(
        map((res) => {
          return res
        }), catchError(this.handleError)
      );
  }

  /**
   * General error handling method.
   * @param error The error that occurred.
   */
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
      return this.http.post<Project>(`${projectsUrl}`, JSON.stringify(project), httpOptions)
        .toPromise()
        .then((project) => this.setSelected(project));
      console.log('project saved')
      //.catch((error: any) => {
      //TODO Add an error display
      //});
    } else {
      const url = project._links["update"];
      return this.http.put<Project>(url["href"], JSON.stringify(project), httpOptions).toPromise()
        .then((project) => {
          this.setSelected(project);
          console.log("update complete, project:" + project);
        })
      // .catch(() => {
      //   //TODO Add an error display
      //   console.log("update rejected")
      // });
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

  refreshProjectList() {
    return this.requestAllProjects().forEach(project => {
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
      .then(() => this.refreshUserAccountList())
  }

  delete(project: Project) {
    const url = project._links["delete"];
    this.http.delete(url["href"], httpOptions).subscribe((response) => {
      return response as Project;
    });
  }

  getProjectSubjectList(): BehaviorSubject<Array<Project>> {
    return this.projects;
  }


}
