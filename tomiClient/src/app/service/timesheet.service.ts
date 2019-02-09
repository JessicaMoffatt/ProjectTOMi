import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {map} from "rxjs/operators";
import {Entry} from "../model/entry";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Timesheet} from "../model/timesheet";
import {Status} from "../model/status";

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class TimesheetService {
  /** The link used to get,post, and delete entries. */
  private timesheetUrl = `http://localhost:8080/timesheets`;
  /** The link used to get all timesheets for a specified user.*/
  private userTimesheetsUrl = `http://localhost:8080/timesheets/userAccount`;

  timesheets: Timesheet[] = [];

  //this is the position in the array of timesheets that we are currently at
  private currentTimesheetIndex = -1;

  public currentDate;

  public currentStatus = "";

  constructor(private http: HttpClient) {
  }

  getEntries(id: number): Observable<Array<Entry>>{
    return this.http.get(`${this.timesheetUrl}/${id}/entries`).pipe(map((response: Response) => response))
      .pipe(map((data: any) => {
        if (data._embedded !== undefined) {
          let sorted = data._embedded.entries as Entry[];
          sorted = sorted.sort((entry1,entry2) => entry1.id - entry2.id);
          return sorted;
        } else {
          return [];
        }
      }));
  }

  //TODO consider the posibility that currentTimesheetIndex is -1
  async getCurrentTimesheet() {
    return this.timesheets[this.currentTimesheetIndex];
  }

  async getAllTimesheets(userId: number) {
    return this.http.get(`${this.userTimesheetsUrl}/${userId}`).pipe(map((response: Response) => response))
      .pipe(map((data: any) => {
        if (data._embedded !== undefined) {
          return data._embedded.timesheets as Timesheet[];
        } else {
          return [];
        }
      }));
  }

  async populateTimesheets(userId: number) {
    return await this.getAllTimesheets(userId).then((response) => {
      return response.toPromise().then((data)=>{
        this.timesheets = data;
        this.currentTimesheetIndex = 0;

        this.setCurrentDate();
        this.setCurrentStatus().then();
        return this.getCurrentTimesheet();
      });
    });
  }

  setCurrentDate(){
    // force LOCAL time with +'T00:00:00'
    let tempDay = new Date(this.timesheets[this.currentTimesheetIndex].startDate +'T00:00:00');
    let options = {
      year: 'numeric', month: 'long', day: 'numeric'
    };

    this.currentDate = tempDay.toLocaleString('en-US', options);
  }

  async setCurrentStatus(){
    if(this.currentTimesheetIndex != -1){
      this.currentStatus = this.timesheets[this.currentTimesheetIndex].status.toString();
    }
  }

  async submit(){
    let tempSheet: Timesheet = null;

    await this.getCurrentTimesheet().then(
      (data)=>{
        const url = data._links["submit"];

        this.http.put<Timesheet>(url["href"],data, httpOptions).toPromise().then(response => {
          tempSheet = response;

          return response;
        }).catch((error: any) => {
          //TODO
        });

        return tempSheet;
      });
  }
}
