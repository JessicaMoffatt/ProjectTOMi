import {Injectable} from '@angular/core';
import {Entry} from "../model/entry";
import {Observable, of} from "rxjs";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {map} from "rxjs/operators";
import {Task} from '../model/task';
import {UnitType} from "../model/unitType";

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class EntryService {

  private entriesUrl = 'http://localhost:8080/entries';
  private tasksUrl = 'http://localhost:8080/tasks';
  private unitTypeUrl = 'http://localhost:8080/unit_types';

  constructor(private http: HttpClient) { }

  //TODO add error handling
  getTasks(): Observable<Array<Task>> {
    return this.http.get(`${this.tasksUrl}`).pipe(map((response: Response) => response))
      .pipe(map((data: any) => {
        if (data._embedded !== undefined) {
          return data._embedded.tasks as Task[];
        } else {
          return [];
        }
      }));
  }

  //TODO add error handling
  getUnitTypes(): Observable<Array<UnitType>> {
    return this.http.get(`${this.unitTypeUrl}`).pipe(map((response: Response) => response))
      .pipe(map((data: any) => {
        if (data._embedded !== undefined) {
          return data._embedded.unitTypes as UnitType[];
        } else {
          return [];
        }
      }));
  }

  /**
   * Saves a specified entry. If the entry is new (ID of -1) an HTTP POST is performed, else a PUT is performed to update the existing team.
   * @param team The team to update/create.
   */
  async save(entry: Entry) {
    let tempEntry: Entry = null;
    if (entry.id === -1) {
      await this.http.post<Entry>(this.entriesUrl, JSON.stringify(entry), httpOptions).toPromise().then(response => {
        tempEntry = response;
        return response;
      }).catch((error: any) => {
        //TODO
      });
    } else {
      const url = entry._links["update"];
      this.http.put<Entry>(url["href"], JSON.stringify(entry), httpOptions).toPromise().then((response) => {

        tempEntry = response;
        return response;
      }).catch((error: any) => {
        //TODO
      });
    }

    return tempEntry;
  }
}

