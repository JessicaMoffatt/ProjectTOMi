import {Injectable} from '@angular/core';
import {catchError, map} from "rxjs/operators";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Task} from '../model/task';
import {BehaviorSubject, Observable} from "rxjs";
import {UserAccount} from "../model/userAccount";
import {MatSnackBar} from "@angular/material";
import {ErrorService} from "./error.service";


const httpOptions: any = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

/**
 * Service class responsible for communication of task model objects with the back end.
 *
 * @author Karol Talbot
 * @version 2.0
 */
@Injectable({
  providedIn: 'root'
})
export class TaskService {


  private taskUrl = "http://localhost:8080/tasks";
  private taskSubjectList: BehaviorSubject<Array<Task>> = new BehaviorSubject<Array<Task>>([]);

  public constructor(private http: HttpClient, public snackBar: MatSnackBar) {

  }

  /*
   * Loads a list of tasks retrieved from the back end into a BehaviorSubject object that can be used to retrieve the Tasks.
   */
  public initializeTasks() {
    return this.requestAllTasks().forEach(tasks => {
      this.taskSubjectList = new BehaviorSubject<Array<Task>>(tasks);
    }).catch((error: any) => {
      console.log("Task error " + error);
    });
  }


  refreshTasks() {
    let freshTasks: Task[];

    this.requestAllTasks().forEach(tasks => {
      freshTasks = tasks;

      //Replace all tasks with fresh task data
      freshTasks.forEach(freshTask => {
        let index = this.taskSubjectList.getValue().findIndex((staleTask) => {
          return (staleTask.id === freshTask.id);
        });

        // If the id didn't match any of the existing ids then add it to the list.
        if (index === -1) {
          this.taskSubjectList.getValue().push(freshTask);

          // id was found and this UserAccount will be replaced with fresh data
        } else {
          this.taskSubjectList.getValue().splice(index, 1, freshTask);
        }
      });

      // Check for any deleted task
      this.taskSubjectList.getValue().forEach(oldTask => {
        let index = freshTasks.findIndex(newTask => {
          return (newTask.id === oldTask.id);
        });

        if (index === -1) {
          let indexToBeRemoved = this.taskSubjectList.getValue().findIndex((taskToBeRemoved) => {
            return (taskToBeRemoved.id === oldTask.id);
          });

          this.taskSubjectList.getValue().splice(indexToBeRemoved, 1);
        }
      });
    }).catch((error: any) => {
      console.log("Task Error")
    });
  }


  requestAllTasks() {
    let obsTasks: Observable<Array<Task>>;
    obsTasks = this.http.get(this.taskUrl).pipe(catchError(ErrorService.handleError()))
      .pipe(map((response: Response) => response))
      .pipe(map((data: any) => {
        return data._embedded.tasks as Task[];
      }));
    return obsTasks;
  }


  async save(task: Task) {
    if (task.id === -1) {
      await this.http.post<UserAccount>(this.taskUrl, JSON.stringify(task), httpOptions).toPromise().then(response => {
        this.refreshTasks();
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
        this.refreshTasks();
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


  delete(task: Task) {
    const url = task._links["self"];
    this.http.delete(url["href"], httpOptions).toPromise().then(response => {
      this.refreshTasks();
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

  public getTaskSubjectList(): BehaviorSubject<Array<Task>> {
    return this.taskSubjectList;
  }
}
