import { Injectable } from '@angular/core';
import {Entry} from "./entry";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class EntryService {

  constructor() { }

  copyEntry(entry: Entry){

  }

  addEntry(entry: Entry){

  }

  deleteEntry(entry: Entry){

  }

  updateEntry(entry: Entry): Observable<any>{
    // return this.http.put()
    return null;
  }

  getEntries(): Observable<Entry[]>{
    return null;
  }
}

