import { Injectable } from '@angular/core';
import {Entry} from "../model/entry";
import {Observable, of} from "rxjs";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {catchError, map, tap} from 'rxjs/operators';

const httpOptions ={
  headers: new HttpHeaders({ 'Content-Type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class EntryService {

  private entriesUrl = 'api/entries';

  constructor(
    private http: HttpClient
  ) { }

  saveEntry(entry: Entry){
    // return this.http.post<Entry>(this.entriesUrl, entry, httpOptions).pipe(
    //   catchError(this.handleError<Entry>('addEntry'))
    // );
  }

  deleteEntry(entry: Entry | number): Observable<Entry>{
    // const id = typeof entry === 'number' ? entry : entry.id;
    // const url = `${this.entriesUrl}/${id}`;

    // return this.http.delete<Entry>(url, httpOptions).pipe(catchError(this.handleError<Entry>('deleteEntry')));
    return null;
  }

  updateEntry(entry: Entry): Observable<any>{
    // return this.http.put()
    return null;
  }

  getEntries(): Observable<Entry[]>{
    return this.http.get<Entry[]>(this.entriesUrl);
  }
  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}

