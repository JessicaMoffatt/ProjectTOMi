import {Injectable} from '@angular/core';
import {map} from "rxjs/operators";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Task} from '../model/task';
import {BehaviorSubject, Observable} from "rxjs";
import {UserAccount} from "../model/userAccount";
import {MatSnackBar} from "@angular/material";
import {taskUrl} from "../configuration/domainConfiguration";


const httpOptions: any = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

/**
 * TaskService is used to control the flow of data regarding tasks to/from the view.
 *
 * @author Karol Talbot
 * @version 2.0
 */
@Injectable({
  providedIn: 'root'
})
export class TaskService {

  /** The list of all active Tasks. */
  private taskSubjectList: BehaviorSubject<Array<Task>> = new BehaviorSubject<Array<Task>>([]);

  public constructor(private http: HttpClient, public snackBar: MatSnackBar) {

  }

  /**
   * Gets the list of all active Tasks and populates them into the taskSubjectList.
   */
  public initializeTasks() {
    return this.requestAllTasks().forEach(tasks => {
      this.taskSubjectList = new BehaviorSubject<Array<Task>>(tasks);
      this.sortTasks();
    }).catch((error: any) => {
      console.log("Task error " + error);
    });
  }

  /**
   * Sends a GET message to the server to retrieve all active Tasks.
   */
  requestAllTasks() {
    let obsTasks: Observable<Array<Task>>;
    obsTasks = this.http.get(taskUrl)
      .pipe(map((data: any) => {
        return data._embedded.tasks as Task[];
      }));
    return obsTasks;
  }

  /**
   * Saves the specified Task. If the Task is new (id = -1), an HTTP POST is performed,
   * else an HTTP PUT is performed to update the existing Task.
   *
   * @param task The Task to be created/updated.
   */
  async save(task: Task) {
    if (task.id === -1) {
      await this.http.post<UserAccount>(taskUrl, JSON.stringify(task), httpOptions).toPromise().then(response => {
        this.initializeTasks();
        let addUserSuccessMessage = task.name + ' added successfully.';
        this.snackBar.open(addUserSuccessMessage, null, {
          duration: 4000,
          politeness: 'assertive',
          panelClass: 'snackbar-success',
          horizontalPosition: 'right'
        });
      }).catch((error: any) => {
        let addUserErrorMessage = 'Something went wrong when adding ' + task.name + ' ' + '. Please contact your system administrator.';
        this.snackBar.open(addUserErrorMessage, null, {
          duration: 5000,
          politeness: 'assertive',
          panelClass: 'snackbar-fail',
          horizontalPosition: 'right'
        });
      });
    } else {
      const url = task._links["self"];
      await this.http.put<UserAccount>(url["href"], JSON.stringify(task), httpOptions).toPromise().then(response => {
        this.initializeTasks();
        let editUserSuccessMessage = task.name + ' ' + ' updated successfully.';
        this.snackBar.open(editUserSuccessMessage, null, {
          duration: 4000,
          politeness: 'assertive',
          panelClass: 'snackbar-success',
          horizontalPosition: 'right'
        });
      }).catch((error: any) => {
        let editUserErrorMessage = 'Something went wrong when updating ' + task.name + ' ' + '. Please contact your system administrator.';
        this.snackBar.open(editUserErrorMessage, null, {
          duration: 5000,
          politeness: 'assertive',
          panelClass: 'snackbar-fail',
          horizontalPosition: 'right'
        });
      });
    }
  }

  /**
   * Logically deletes the selected Task (sets the active status to false.)
   *
   * @param task The Task to be deleted.
   */
  delete(task: Task) {
    const url = task._links["self"];
    this.http.delete(url["href"], httpOptions).toPromise().then(response => {
      this.initializeTasks();
      let deleteUserSuccessMessage = task.name + ' ' + ' deleted successfully.';
      this.snackBar.open(deleteUserSuccessMessage, null, {
        duration: 4000,
        politeness: 'assertive',
        panelClass: 'snackbar-success',
        horizontalPosition: 'right'
      });
    }).catch((error: any) => {
      let deleteUserErrorMessage = 'Something went wrong when deleting ' + task.name + ' ' + '. Please contact your system administrator.';
      this.snackBar.open(deleteUserErrorMessage, null, {
        duration: 5000,
        politeness: 'assertive',
        panelClass: 'snackbar-fail',
        horizontalPosition: 'right'
      });
    });
  }

  /**
   * Returns taskSubjectList.
   */
  public getTaskSubjectList(): BehaviorSubject<Array<Task>> {
    return this.taskSubjectList;
  }

  /**
   * Sorts the Tasks in the taskSubjectList by ascending name.
   */
  sortTasks() {
    this.taskSubjectList.getValue().sort((client1, client2) => {
      let name1 = client1.name.toLowerCase();
      let name2 = client2.name.toLowerCase();
      if (name1 > name2) {
        return 1;
      }
      if (name1 < name2) {
        return -1;
      }
      return 0;
    });
  }
}
