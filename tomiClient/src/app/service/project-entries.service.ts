import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {Project} from "../model/project";
import {ProjectService} from "./project.service";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {map} from "rxjs/operators";
import {Entry} from "../model/entry";
import {Status} from "../model/status";
import {SignInService} from "./sign-in.service";

const headers = new HttpHeaders({
    'Content-Type': 'application/json'
  });

@Injectable({
  providedIn: 'root'
})
export class ProjectEntriesService {

  /**
   * The ID of this signed in user.
   */
  userId = this.signInService.userAccount.id;

  /**
   * The list of projects for this user.
   */
  projects: Project[] = [];

  /**
   * The list of entries this user is allowed to view.
   */
  entries: Entry[] = [];

  /**
   * The selected project.
   */
  selectedProject: Project;

  constructor(private projectService: ProjectService, private http: HttpClient, private signInService:SignInService) {

  }

  /**
   * Sends a GET message to the server to retrieve all active Projects for the signed in user.
   */
  getAllProjects(): Observable<Array<Project>> {
    return this.projectService.getProjectsForUser(this.userId);
  }

  /**
   * Sends a GET message to the server to retrieve the Project by their ID.
   * @param id
   */
  getProjectById(id: string): Observable<Project> {
    return this.projectService.getProjectById(id);
  }

  /**
   * Sets entries to the Entries retrieved through populateEntries.
   */
  async displayProjectEntries() {
    this.populateEntries(this.selectedProject).subscribe((data) => {
      this.entries = data;
    });
  }

  /**
   * Sends a GET message to the server to retrieve all submitted Entries for the specified Project.
   * @param project The Project to get entries for.
   */
  populateEntries(project: Project): Observable<Array<Entry>> {
    let url = project._links["entries"];
    return this.http.get(url["href"])
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
  async submit(){
    for(const item of this.entries){
      await this.evaluateEntry(item);
    }
  }

  /**
   * Evaluates the specified entry. If the Entry's status is approved, begins the process of PUTing the approval request,
   * else if the Entry's status is rejected, begins the process of PUTing the rejection request.
   * If the Entry has neither status, no further action is taken.
   * @param entry The entry to evaluate the status of.
   */
  async evaluateEntry(entry:Entry){
    if(entry.status === Status.APPROVED){
          await this.promiseApproval(entry).then();
        }else if(entry.status === Status.REJECTED){
          await this.putRejectionRequest(entry).then((data) => {
            return data;
          });
        }
  }

  async promiseApproval(currEntry:Entry){
    let promise = new Promise((resolve,reject)=>{
      resolve(this.putApprovalRequest(currEntry));
    });

    return await promise;
  }

  async putApprovalRequest(entry:Entry){
    let url = entry._links["evaluate"];
    let temp = null;
    await this.http.put(url,'"APPROVED"', {headers:headers, observe:"response"}).toPromise().then(response => {
      temp = response;

      return response;
    }).catch(() => {
      return null;
    });

    return temp;
  }

  async putRejectionRequest(entry:Entry): Promise<Entry>{
    let url = entry._links["evaluate"];
    let temp = null;
    await this.http.put(url,'"REJECTED"', {headers:headers, observe:"response"}).toPromise().then(response => {
      temp = response;
      return response;
    }).catch(() => {
      return null;
    });

    return temp;
  }
}
