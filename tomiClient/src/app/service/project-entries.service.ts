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

  userId = this.signInService.userAccount.id;

  projects: Project[] = [];
  entries: Entry[] = [];

  selectedProject: Project;

  constructor(private projectService: ProjectService, private http: HttpClient, private signInService:SignInService) {

  }

  getAllProjects(): Observable<Array<Project>> {
    return this.projectService.getProjectsForUser(this.userId);
  }

  getProjectById(id: string): Observable<Project> {
    return this.projectService.getProjectById(id);
  }

  async displayProjectEntries() {
    this.populateEntries(this.selectedProject).subscribe((data) => {
      this.entries = data;
    });
  }

  populateEntries(project: Project): Observable<Array<Entry>> {
    let url = project._links["entries"];
    return this.http.get(url["href"]).pipe(map((response: Response) => response))
      .pipe(map((data: any) => {
        if (data._embedded !== undefined) {
          let sorted = data._embedded.entries as Entry[];
          sorted = sorted.sort((entry1, entry2) => entry1.timesheet - entry2.timesheet);
          return sorted;
        } else {
          return [];
        }
      }));
  }

  async submit(){
    for(const item of this.entries){
      await this.evaluateEntry(item);
    }
  }

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
