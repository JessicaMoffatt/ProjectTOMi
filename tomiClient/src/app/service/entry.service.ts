import {Injectable} from '@angular/core';
import {Entry} from "../model/entry";
import {Observable} from "rxjs";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {catchError, map} from "rxjs/operators";
import {Task} from '../model/task';
import {UnitType} from "../model/unitType";
import {Team} from "../model/team";
import {entryUrl} from "../configuration/domainConfiguration";
import {taskUrl} from "../configuration/domainConfiguration";
import {unitTypeUrl} from "../configuration/domainConfiguration";
import {Client} from "../model/client";
import {ErrorService} from "./error.service";

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

/**
 * EntryService is used to control the flow of data regarding entries to/from the view.
 *
 * @author Jessica Moffatt
 * @version 2.0
 */
@Injectable({
  providedIn: 'root'
})
export class EntryService {

  /** The URL used to get,post, and delete entries. */
  private entriesUrl = '/entries';
  /** The URL used to get,post, and delete tasks. */
  private tasksUrl = 'http://localhost:8080/tasks';
  /** The URL used to get,post, and delete unit types. */
  private unitTypeUrl = 'http://localhost:8080/unit_types';

  constructor(private http: HttpClient, private errorService: ErrorService) { }

  /**
   * Gets all tasks.
   */
  getTasks(): Observable<Array<Task>> {
    return this.http.get(`${taskUrl}`)
      .pipe(catchError(this.errorService.handleError<Client[]>([])))
      .pipe(map((data: any) => {
        if (data._embedded !== undefined) {
          return data._embedded.tasks as Task[];
        } else {
          return [];
        }
      }))
  }

  /**
   * Gets all unit types.
   */
  getUnitTypes(): Observable<Array<UnitType>> {
    return this.http.get(`${unitTypeUrl}`)
      .pipe(catchError(this.errorService.handleError<Client[]>([])))
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
   * @param entry The team to update/create.
   */
  async save(entry: Entry) {
    let tempEntry: Entry = null;
    if (entry.id === -1) {
      await this.http.post<Entry>(entryUrl, JSON.stringify(entry), httpOptions).toPromise().then(response => {
        tempEntry = response;
        return response;
      }).catch(() => {
        catchError(this.errorService.handleError<Client[]>([]))
        return null;
      });
    } else if(entry.id >= 1){
      const url = entry._links["update"];

      await this.http.put<Entry>(url["href"], JSON.stringify(entry), httpOptions).toPromise().then((response) => {

        tempEntry = response;
        return response;
      }).catch(() => {
        catchError(this.errorService.handleError<Client[]>([]))
        return null;
      });
    }

    return tempEntry;
  }

  /**
   * Copies the specified entry.
   * @param entry The entry to copy.
   */
  async copy(entry: Entry) {
    let tempEntry: Entry = null;
    const url = entry._links["copy"];
      await this.http.post<Entry>(url["href"],null, httpOptions).toPromise().then(response => {
        tempEntry = response;
        return response;
      }).catch(() => {
        return null;
      });

    return tempEntry;
  }

  /**
   * Deletes the specified entry.
   * @param entry The entry to delete.
   */
  delete(entry:Entry){
    const url = entry._links["delete"];

    this.http.delete(url["href"], httpOptions).subscribe((response) => {
      return response as Team;
    });
  }
}

