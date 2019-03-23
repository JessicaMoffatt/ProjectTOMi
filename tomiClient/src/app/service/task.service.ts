import { Injectable } from '@angular/core';
import {map} from "rxjs/operators";
import {HttpClient} from "@angular/common/http";
import {Task} from '../model/task';
import {taskUrl} from "../configuration/domainConfiguration";

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(private http: HttpClient) { }

  getTaskById(id:number){
    return this.http.get(`${taskUrl}/${id}`).pipe(map((response: Response) => response))
      .pipe(map((data: any) => {
        if (data !== undefined) {
          return data as Task;
        } else {
          return null;
        }
      }));
  }
}
