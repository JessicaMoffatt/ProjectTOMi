import {Injectable} from '@angular/core';
import {catchError, map} from "rxjs/operators";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {BehaviorSubject, Observable} from "rxjs";
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
import {Client} from "../model/client";
import {ErrorService} from "./error.service";

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

const headers = new HttpHeaders({
  'Content-Type': 'application/json'
});


/**
 * ProjectService is used to control the flow of data regarding user accounts to/from the view.
 * @author Jessica Moffatt
 * @author James Andrade
 * @author Karol Talbot
 * @version 3.0
 */
@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  /** The budget associated with the selected Project.*/
  selectedBudget: BudgetReport;

  /** The billable hour report for all Projects.*/
  billableReport: BillableHoursReportLine[] = [];

  /** The actual hours spent working on a Project.*/
  percentActual: number = 0;

  /** The percent of budgeted hours remaining.*/
  percentRemaining: number = 0;

  /** The general expression used to check if projectId is valid */
  public readonly regExp: string = "[A-Z]{2}[0-9]{4}";

  /** Tracks which Project is selectedProject in project-panel component and manage-project modal.*/
  private selectedProject: Project = new Project();

  /** The list of all active Projects. */
  projects: BehaviorSubject<Array<Project>> = new BehaviorSubject([]);

  /** The UserAccounts assigned to the current project.*/
  userAccountList: BehaviorSubject<Array<UserAccount>> = new BehaviorSubject([]);

  /** The client associated with the selected Project.*/
  private selectedClient: Client = new Client();

  constructor(private http: HttpClient,
              public snackBar: MatSnackBar,
              private expenseService: ExpenseService,
              private signInService:SignInService,
              private errorService: ErrorService) {
  }

  /**
   * Sends a GET message to the server to retrieve all active Projects.
   */
  getAllProjects(): Observable<Array<Project>> {
    return this.http.get(`${projectsUrl}`)
      .pipe(map((data: any) => {
          if (data !== undefined && data._embedded !== undefined) {
            return data._embedded.projects as Project[];
          } else {
            return [];
          }
        }), catchError(this.errorService.handleError<Project[]>())
      );
  }

  /**
   * Sends a GET message to the server to retrieve the Projects for a specified UserAccount by their ID.
   * @param userId The ID of the UserAccount whose Projects we want.
   */
  getProjectsForUser(userId: number): Observable<Array<Project>> {
    return this.http.get(`${userAccountUrl}/${userId}/projects`)
      .pipe(catchError(this.errorService.handleError<Client[]>()))
      .pipe(map((data: any) => {
        if (data === null) {
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
   * Sets the selected Project.
   * @param project the project to be stored as selectedProject.
   */
  async setSelected(project: Project) {
    this.selectedProject = await project;
    if (this.selectedProject != null && this.selectedProject.id.match(this.regExp)) {
      this.refreshUserAccountList();
      this.expenseService.refreshExpenses(this.selectedProject);
      this.getBudgetReportByProjectId(project).toPromise()
        .then(
          data => {
            this.selectedBudget = data;
            this.percentActual = this.calculatePercentActual();
            this.percentRemaining = 100 - this.percentActual;
          },
          () => this.errorService.displayErrorMessage('project.service setSelected()')
        );
    }
    this.selectedClient.name = this.selectedProject.client.name;
    this.selectedClient.id = this.selectedProject.client.id;
    this.selectedClient._links = this.selectedProject._links;

    return this.selectedProject;
  }

  /** Returns selectedProject.*/
  getSelectedProject() {
    return this.selectedProject;
  }

  /** Returns selectedClient.*/
  getSelectedClient() {
    return this.selectedClient;
  }

  /**
   * Sends a GET message to the server to retrieve the Project by their ID.
   * @param id The ID of the project to get.
   */
  getProjectById(id: string) {
    return this.http.get(`${projectsUrl}/${id}`)
      .pipe(
        map((res: Project) => {
          return res
        }), catchError(this.errorService.handleError())
      );
  }

  /**
   * Sends a GET message to the server to retrieve the BudgetReport for the specified Project.
   * @param project The Project to get a budget report for.
   */
  getBudgetReportByProjectId(project: Project) {
    let url = project._links["budget"];
    return this.http.get(`${url["href"]}`)
      .pipe(
        map((res: BudgetReport) => {
          return res
        })
      );
  }

  /**
   * Calculates the percent billable for the Budget Report.
   */
  calculatePercentBillable(): string {
    if (this.selectedBudget) {
      let percent = this.selectedBudget.billableHours / this.selectedBudget.totalHours * 100;
      let percentString = percent.toFixed(2);

      return percentString;
    } else {
      return "0";
    }
  }

  /**
   * Calculates the percent of actual hours spent on the Project, for the Budget Report.
   */
  calculatePercentActual(): number {
    if (this.selectedBudget) {
      return this.selectedBudget.totalHours / this.selectedBudget.project.budgetedHours * 100;
    } else {
      return 0;
    }
  }

  /**
   * Sends a GET message to the server to retrieve the lines for the billable hours report.
   */
  getBillableReport() {
    return this.http.get(billableUrl)
      .pipe(catchError(this.errorService.handleError()))
      .pipe(
        map((res: BillableHoursReportLine[]) => {
          if (res !== undefined)
            return res
          else
            return []
        })
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
        }), catchError(this.errorService.handleError())
      );
  }

  /**
   * Retrieves the billable hour report as an xls file download.
   */
  downloadBillableReport() {
    return this.http.get(`${billableHourDownloadUrl}`, {responseType: 'blob'})
      .pipe(
        map((res) => {
          return res
        }), catchError(this.errorService.handleError())
      );
  }

  /**
   * Saves the specified Project. If the Project is new (id = 2), an HTTP POST is performed,
   * else an HTTP PUT is performed to update the existing Project.
   *
   * @param project The Project to be created/updated.
   */
  async save(project: Project) {
    if (project.id.length == 2) {
      return this.http.post<Project>(`${projectsUrl}`, JSON.stringify(project), httpOptions)
        .toPromise()
        .then((project) => {
          this.setSelected(project);
          this.signInService.getNavBarList();
        })
        .catch(() => this.errorService.displayError());;
    } else {
      const url = project._links["update"];

      return this.http.put<Project>(url["href"], JSON.stringify(project), httpOptions).toPromise()
        .then((project) => {
          this.signInService.getNavBarList();
        })
        .catch(() => this.errorService.displayError());
    }
  }

  /**
   * Performs an http PUT request to add the specified UserAccount(using their ID) to the Project.
   * @param userAccountId The ID of the UserAccount to add to the Project.
   */
  addUser(userAccountId: number) {
    let url = `${projectsUrl}/${this.getSelectedProject().id}/add_member/${userAccountId}`;
    this.http.put<UserAccount>(url, httpOptions).toPromise()
      .then((response) => {
        this.refreshUserAccountList();
        return response;
      }).catch(() => {
      this.errorService.displayError();
      return null;
    });
  }

  /**
   * Gets the list of all active Projects and populates them into the projects list.
   */
  refreshProjectList() {
    return this.getAllProjects().forEach(project => {
      this.projects = new BehaviorSubject<Array<Project>>(project);
      this.sortProjects();
    }).catch(() => {
      let getUsersErrorMessage = 'Something went wrong when getting the list of projects. Please contact your system administrator.';
      this.snackBar.open(getUsersErrorMessage, null, {
        duration: 5000,
        politeness: 'assertive',
        panelClass: 'snackbar-fail',
        horizontalPosition: 'right'
      });
    });
    this.getAllProjects().toPromise().then(project =>
      this.projects = new BehaviorSubject<Array<Project>>(project))
  }

  /**
   * Sorts the Projects in the projects list by ascending name.
   */
  sortProjects() {
    this.projects.getValue().sort((project1, project2) => {
      let name1 = project1.projectName.toLowerCase();
      let name2 = project2.projectName.toLowerCase();
      if (name1 > name2) {
        return 1;
      }
      if (name1 < name2) {
        return -1;
      }
      return 0;
    });
  }

  /**
   * Sends a GET message to the server to retrieve all UserAccounts associated with this Project.
   */
  refreshUserAccountList() {
    this.http.get(`${projectsUrl}/${this.selectedProject.id}/members`)
      .pipe(catchError(this.errorService.handleError()))
      .pipe(map((data: any) => {
        if (data !== undefined) {
          return data as UserAccount[];
        } else {
          return [];
        }
      })).toPromise().then(userAccount => {
      this.userAccountList = new BehaviorSubject<Array<UserAccount>>(userAccount);
    })
  }

  /**
   * Performs an http PUT request to remove the specified UserAccount from the Project.
   * @param userId
   */
  removeUser(userId: number) {
    this.http.put(`${projectsUrl}/${this.selectedProject.id}/remove_member/${userId}`, httpOptions).toPromise()
      .then(() => this.refreshUserAccountList())
      .catch(() => this.errorService.displayError())
  }

  /**
   * Logically deletes the selected Project (sets the active status to false.)
   * @param project The Project to be deleted.
   */
  delete(project: Project) {
    const url = project._links["delete"];
    this.http.delete(url["href"], httpOptions).toPromise().then((response) => {
      this.refreshProjectList();
      return response as Project;
    });
  }

  /**
   * Gets the Entries for the selected Project.
   * @param project The Project to get Entries for.
   */
  async getEntries(project: Project) {
    let entryList: BehaviorSubject<Array<Entry>>;
    entryList = new BehaviorSubject([]);
    await this.populateEntries(project).forEach(entries => {
      entryList = new BehaviorSubject<Array<Entry>>(entries);
    }).catch((error: any) => {
    });
    return entryList;
  }

  /**
   * Evaluates the specified entry. If the Entry's status is approved, begins the process of PUTing the approval request,
   * else if the Entry's status is rejected, begins the process of PUTing the rejection request.
   * If the Entry has neither status, no further action is taken.
   * @param entry The entry to evaluate the status of.
   */
  async evaluateEntry(entry: Entry) {
    if (entry.status === Status.APPROVED) {
      await this.putApprovalRequest(entry).then((data) => {
        return data;
      });
    } else if (entry.status === Status.REJECTED) {
      await this.putRejectionRequest(entry).then((data) => {
        return data;
      });
    }
  }

  /**
   * Wraps the putApprovalRequest method call in a promise.
   *
   * @param currEntry The Entry currently being evaluated.
   */
  async promiseApproval(currEntry: Entry) {
    let promise = new Promise(resolve => resolve(this.putApprovalRequest(currEntry)));
    return await promise;
  }

  /**
   * Performs an http PUT request to change the Entry's status to APPROVED.
   * @param entry The Entry to be approved.
   */
  async putApprovalRequest(entry: Entry) {
    let url: string = entry._links["evaluate"]["href"];
    let temp = null;
    await this.http.put(url, '"APPROVED"', {headers: headers, observe: "response"}).toPromise().then(response => {
      temp = response;

      return response;
    }).catch(() => {
      return null;
    });
    return temp;
  }

  /**
   * Performs an http PUT request to change the Entry's status to REJECTED.
   * @param entry The Entry to be rejected.
   */
  async putRejectionRequest(entry: Entry): Promise<Entry> {
    let url: string = entry._links["evaluate"]["href"];
    let temp = null;
    await this.http.put(url, '"REJECTED"', {headers: headers, observe: "response"}).toPromise().then(response => {
      temp = response;
      return response;
    }).catch(() => {
      return null;
    });

    return temp;
  }

  /**
   * Sends a GET message to the server to retrieve all submitted Entries for the specified Project.
   * @param project The Project to get entries for.
   */
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

  /**
   * For each entry of the selected project, calls evaluateEntry which in tern performs either an approval or rejection.
   */
  async submit(entries) {
    return await entries.forEach((component: EntryApproveComponent) => {
      let entry = component.entry;
      return this.evaluateEntry(entry);
    });
  }

  /**
   * Returns projects.
   */
  getProjects(): BehaviorSubject<Array<Project>> {
    return this.projects;
  }
}
