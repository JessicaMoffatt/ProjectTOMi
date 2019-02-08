import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {map} from "rxjs/operators";
import {Entry} from "../model/entry";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Timesheet} from "../model/timesheet";

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

  //TODO, this is the position in the array of timesheets that we are currently at
  private currentTimesheet = -1;

  constructor(private http: HttpClient) {
  }

  getEntries(id: number): Observable<Array<Entry>>{
    return this.http.get(`${this.timesheetUrl}/${id}/entries`).pipe(map((response: Response) => response))
      .pipe(map((data: any) => {
        if (data._embedded !== undefined) {
          return data._embedded.entries as Entry[];
        } else {
          return [];
        }
      }));
  }

  //TODO consider the posibility that currentTimesheet is -1
  async getCurrentTimesheet() {
    return this.timesheets[this.currentTimesheet];
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
        this.currentTimesheet = this.timesheets.length -1;
        return this.getCurrentTimesheet();
      });
    });
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
