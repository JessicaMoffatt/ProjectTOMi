import {ComponentRef, Injectable, Input} from '@angular/core';
import {Task} from "../model/task";
import {BehaviorSubject, Observable} from "rxjs";
import {map} from "rxjs/operators";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {combineLatest} from "rxjs";
import {Team} from "../model/team";
import {any} from "codelyzer/util/function";

 const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})

export class TaskPanelService {

  /** The link used to get,post, and delete tasks. */
  private taskUrl = `http://localhost:8080/tasks/`;

  /** Used to reference the add task component created by clicking the Add Task button.*/
  ref: ComponentRef<any>;

  /** The task selectedProject in the sidebar.*/
  selectedTask: Task = new Task();

  /** List of all the tasks.*/
//  @Input() tasks: Task[];


  tasksObservable : Observable<Array<Task>>;

  tasks: Task[];

  constructor(private http: HttpClient) {
    this.tasksObservable = this.getAllTasks();
    this.getAllTasks().subscribe((data: Array<Task>) => {
      this.tasks = data;
    });
  }

  /**
   * Removes a member from the selectedProject team.
   */
  delete(task: Task) {

   // let index = this.tasksObservable..findIndex((element) => {
   //   return (element.id == task.id);
   // });

    // this.tasks.splice(index, 1);

    const url = task._links["delete"];

    this.http.delete(url["href"], httpOptions).subscribe((response) => {
      this.tasksObservable = this.getAllTasks();
     //console.log("tasks obs:"+this.tasksObservable);
      //return response as Task;
    });

  }

  
  /**
   * Gets a list of all the tasks.
   */
  getAllTasks(): Observable<Array<Task>> {
    return this.http.get(this.taskUrl).pipe(map((response: Response) => response))
      .pipe(map((data: any) => {
        return data._embedded.tasks as Task[];
      }));
  }

  /**
   * Sets the selectedProject team member.
   * @param account The user account whom has been selectedProject.
   */
  setSelectedTask(task: Task) {
    this.selectedTask = task;
  }




  //TODO add error handling!!
  /**
   * Saves a specified task. If the team is new (ID of -1) an HTTP POST is performed, else a PUT is performed to update the existing team.
   * @param team The team to update/create.
   */
  async save(task: Task) {
    let testTask: Task = null;
    if (task.id === -1) {

      await this.http.post<Task>(this.taskUrl, JSON.stringify(task), httpOptions).toPromise().then(response => {
        testTask = response;
        this.tasksObservable = this.getAllTasks();
        return response;
      }).catch((error: any) => {
        //TODO
      });
    } else {
      const url = task._links["update"];
      this.http.put<Task>(url["href"], JSON.stringify(task), httpOptions).toPromise().then((response) => {
        // this.reloadTasks();
        this.tasksObservable = this.getAllTasks();
        testTask = response;
        return response;
      }).catch((error: any) => {
        //TODO
      });
    }

    return testTask;
  }

  /**
   * Destroys the dynamically created add task component.
   */
  destroyAddTaskComponent() {
    this.ref.destroy();
  }

  /**
   * Destroys the dynamically created add task component.
   */
  destroyEditTaskComponent() {
    this.ref.destroy();
  }

}
