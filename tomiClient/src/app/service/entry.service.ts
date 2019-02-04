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

  constructor(
    private http: HttpClient
  ) {
  }

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

  saveEntry(entry: Entry) {
    // return this.http.post<Entry>(this.entriesUrl, entry, httpOptions).pipe(
    //   catchError(this.handleError<Entry>('addEntry'))
    // );
  }

  deleteEntry(entry: Entry | number): Observable<Entry> {
    // const id = typeof entry === 'number' ? entry : entry.id;
    // const url = `${this.entriesUrl}/${id}`;

    // return this.http.delete<Entry>(url, httpOptions).pipe(catchError(this.handleError<Entry>('deleteEntry')));
    return null;
  }

  updateEntry(entry: Entry): Observable<any> {
    // return this.http.put()
    return null;
  }


  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}

