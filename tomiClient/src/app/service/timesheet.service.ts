import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {UserAccount} from "../model/userAccount";
import {map} from "rxjs/operators";
import {Entry} from "../model/entry";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Project} from "../model/project";
import {ProjectService} from "./project.service";

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
  private entryUrl = `http://localhost:8080/entries`;

  constructor(private http: HttpClient) { }

  getEntries(id:number): Observable<Array<Entry>> {
    return this.http.get(`${this.entryUrl}`).pipe(map((response: Response) => response))
      .pipe(map((data: any) => {
          if (data._embedded !== undefined) {
          return data._embedded.entries as Entry[];
        } else {
          return [];
        }
      }));
  }
}
