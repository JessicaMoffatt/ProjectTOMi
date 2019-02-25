import {Component, OnInit} from '@angular/core';
import {Task} from "../../../model/task";
import {TaskPanelService} from "../../../service/task-panel.service";

/**
 * AddTaskComponent is used to facilitate communication between the view and front end services.
 * The purpose of a task is to represent which stage a 'unit-type' is in ie. Alpha, Beta but
 * it can have other uses as well.  This form allows the user to assign a new name to
 * a created component and assign a billable status, if desired.  The user has the option to cancel
 * and changes are only persisted on selection of the 'save' button.  The name entered cannot be empty
 * and must not match the name of an already existing task.
 *
 * Note: the addTask method has 2 alert boxes, which will require styling
 *
 * @author James Andrade
 * @version 1.0
 */

@Component({
  selector: 'app-add-task',
  templateUrl: 'add-task.component.html',
  styleUrls: ['./add-task.component.css', '../../../app.component.scss']
})

export class AddTaskComponent implements OnInit {

  constructor(public taskPanelService: TaskPanelService) {
  }

  ngOnInit() {
  }

  /**
   * Adds a new task. Passes on the request to save the new task to the task service.
   */
  addTask() {
    let task = new Task();
    task.name = (<HTMLInputElement>document.getElementById("new_task_name")).value;
    task.billable = (<HTMLInputElement>document.getElementById("new_task_is_billable")).checked;

    // validate data
    let nameAvailable: boolean = true;
    if (task.name === '') {
      alert("The Name of a New Task cannot be empty");
      nameAvailable = false;
    }

    for (let t of this.taskPanelService.tasks) {
      if (task.name === t.name) {
        alert("Task name: " + task.name + " is already taken.");
        nameAvailable = false;
      }
    }

    // save if changes are valid
    if (nameAvailable === true) {
      this.taskPanelService.save(task).then(()=>{
        this.taskPanelService.destroyAddTaskComponent();
      });
    }
  }

  /**
   * Destroys the dynamically created add task component.
   */
  destroyAddTaskComponent() {
    this.taskPanelService.destroyAddTaskComponent();
  }
}
