import {Injectable} from '@angular/core';
import {catchError, map} from "rxjs/operators";
import {HttpClient, HttpErrorResponse, HttpHeaders} from "@angular/common/http";
import {BehaviorSubject, Observable, throwError} from "rxjs";
import {Project} from "../model/project";
import {
  billableHourDownloadUrl,
  billableUrl,
  dataDumpUrl,
  projectsUrl,
  userAccountUrl
} from "../configuration/domainConfiguration";
import {BudgetReport} from "../model/budgetReport";
import {BillableHoursReportLine} from "../model/billableHoursReportLine";
import {UserAccount} from "../model/userAccount";
import {MatSnackBar} from "@angular/material";
import {ExpenseService} from "./expense.service";
import {Entry} from "../model/entry";
import {Status} from "../model/status";
import {EntryApproveComponent} from "../component/panel/entry-approve/entry-approve.component";
import {SignInService} from "./sign-in.service";

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

const headers = new HttpHeaders({
  'Content-Type': 'application/json'
});


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
  percentActual: number = 0;

  /** The percent of budgeted hours remaining.*/
  percentRemaining: number = 0;

  /** general expression used to check if projectId is valid */
  public readonly regExp: string = "[A-Z]{2}[0-9]{4}";

  /** tracks which project is selectedProject in project-panel component and manage-project modal.
   */
  private selectedProject: Project = new Project(); // added by: James Andrade

  /** used to pass list to project related components */
  projects: BehaviorSubject<Array<Project>> = new BehaviorSubject([]); // added by: James Andrade

  /** the user accounts assigned to the current project; for display in project-member-list-component */
  userAccountList: BehaviorSubject<Array<UserAccount>> = new BehaviorSubject([]);

  constructor(private http: HttpClient,
              public snackBar: MatSnackBar,
              private expenseService: ExpenseService,
              private signInService:SignInService) {
  }

  /**
   * Gets all projects.
   */
  getAllProjects(): Observable<Array<Project>> {
    return this.http.get(`${projectsUrl}`)
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
  getProjectsForUser(userId: number): Observable<Array<Project>> {
    return this.http.get(`${userAccountUrl}/${userId}/projects`)
      .pipe(map((data: any) => {
        if(data === null){
          return [];
        }
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
    if (this.selectedProject != null && this.selectedProject.id.match(this.regExp)) {
      this.refreshUserAccountList();
      this.expenseService.refreshExpenses(this.selectedProject);
      this.getBudgetReportByProjectId(project)
        .subscribe(
          data => {
            this.selectedBudget = data;
            this.percentActual = this.calculatePercentActual();
            this.percentRemaining = 100 - this.percentActual;
          },
          error => {
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
  getProjectById(id: string) {
    return this.http.get(`${projectsUrl}/${id}`)
      .pipe(
        map((res: Project) => {
          return res
        }), catchError(this.handleError)
      );
  }

  /**
   *
   * @param project The project to get a report for.
   */
  getBudgetReportByProjectId(project: Project) {
    let url = project._links["budget"];
    return this.http.get(`${url["href"]}`)
      .pipe(
        map((res: BudgetReport) => {
          return res
        }), catchError(this.handleError)
      );
  }

  calculatePercentBillable(): string {
    if (this.selectedBudget) {
      let percent = this.selectedBudget.billableHours / this.selectedBudget.totalHours * 100;
      let percentString = percent.toFixed(2);

      return percentString;
    } else {
      return "0";
    }
  }

  calculatePercentActual(): number {
    if (this.selectedBudget) {
      return this.selectedBudget.totalHours / this.selectedBudget.project.budgetedHours * 100;
    } else {
      return 0;
    }
  }

  getBillableReport() {
    return this.http.get(billableUrl)
      .pipe(
        map((res: BillableHoursReportLine[]) => {
          return res
        }), catchError(this.handleError)
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

  downloadBillableReport(){
    return this.http.get(`${billableHourDownloadUrl}`, {responseType: 'blob'})
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
    this.signInService.getNavBarList();
  }


  addUser(userAccountId: number) {
    let url = `${projectsUrl}/${this.getSelectedProject().id}/add_member/${userAccountId}`;
    console.log(this.selectedProject.id);
    console.log(url);
    this.http.put<UserAccount>(url, httpOptions).toPromise()
      .then((response) => {
        this.refreshUserAccountList();
        return response;
      }).catch((reason) => {
        console.log(reason);
      return null;
    });
  }

  refreshProjectList() {
    return this.getAllProjects().forEach(project => {
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

  async getEntries(project: Project) {
    let entryList: BehaviorSubject<Array<Entry>>;
    entryList = new BehaviorSubject([]);
    await this.populateEntries(project).forEach(entries => {
      entryList = new BehaviorSubject<Array<Entry>>(entries);
    }).catch((error: any) => {
      console.log("Project error " + error);
    });
    return entryList;
  }

  async evaluateEntry(entry: Entry) {
    if (entry.status === Status.APPROVED) {
      await this.putApprovalRequest(entry).then((data) =>{
        return data;
      });
    } else if (entry.status === Status.REJECTED) {
      await this.putRejectionRequest(entry).then((data) => {
        return data;
      });
    }
  }

  async promiseApproval(currEntry: Entry) {
    let promise = new Promise((resolve, reject) => {
      resolve(this.putApprovalRequest(currEntry));
    });

    return await promise;
  }

  async putApprovalRequest(entry: Entry) {
    let url:string = entry._links["evaluate"]["href"];
    let temp = null;
    await this.http.put(url, '"APPROVED"', {headers: headers, observe: "response"}).toPromise().then(response => {
      temp = response;

      return response;
    }).catch(() => {
      return null;
    });
    return temp;
  }

  async putRejectionRequest(entry: Entry): Promise<Entry> {
    let url:string = entry._links["evaluate"]["href"];
    let temp = null;
    await this.http.put(url, '"REJECTED"', {headers: headers, observe: "response"}).toPromise().then(response => {
      temp = response;
      return response;
    }).catch(() => {
      return null;
    });

    return temp;
  }

  populateEntries(project: Project): Observable<Array<Entry>> {
    let url = project._links["entries"];
    return this.http.get(url["href"]).pipe(map((response: Response) => response))
      .pipe(map((data: any) => {
        if (data._embedded !== undefined) {
          let sorted = data._embedded.entries as Entry[];
          sorted = sorted.sort((entry1, entry2) => entry1.timesheet.id - entry2.timesheet.id);
          return sorted;
        } else {
          return [];
        }
      }));
  }

  async submit(entries) {
    return await entries.forEach((component: EntryApproveComponent) => {
      let entry = component.entry;
      return this.evaluateEntry(entry);
    });
  }

  getProjects(): BehaviorSubject<Array<Project>>{
    return this.projects;
  }
}
