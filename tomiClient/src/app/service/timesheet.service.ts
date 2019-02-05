import { Injectable } from '@angular/core';
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

  //TODO, this is the position in the array of timesheets that we are currently at
  private currentTimesheet = new Timesheet();

  constructor(private http: HttpClient) { }

  getEntries(id:number): Observable<Array<Entry>> {
    return this.http.get(`${this.timesheetUrl}/${id}/entries`).pipe(map((response: Response) => response))
      .pipe(map((data: any) => {
          if (data._embedded !== undefined) {
          return data._embedded.entries as Entry[];
        } else {
          return [];
        }
      }));
  }

  //TODO change this
  getCurrentTimesheet(){
    this.currentTimesheet.id = 1;
    return this.currentTimesheet;
  }
}
