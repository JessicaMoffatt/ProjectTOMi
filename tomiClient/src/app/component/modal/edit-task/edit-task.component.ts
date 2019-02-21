import {Component, OnInit} from '@angular/core';
import {Task} from "../../../model/task";
import {TaskPanelService} from "../../../service/task-panel.service";
import {TasksPanelComponent} from "../../panel/tasks-panel/tasks-panel.component";

@Component({
  selector: 'app-edit-task',
  templateUrl: './edit-task.component.html',
  styleUrls: ['./edit-task.component.scss', '../../../app.component.scss']
})

/**
 * EditTaskComponent is used to facilitate communication between the view and front end services.
 * It allows the user to alter the name and 'billable' status of a component and only
 * persists changes on selecting the 'save' button.
 *
 * @author James Andrade
 * @version 1.0
 */


export class EditTaskComponent implements OnInit {

  constructor(public taskPanelService: TaskPanelService) {
  }

  /**
   * On initialization of this component, assigns the team service's list of all members.
   */
  ngOnInit() {
  }

  /**
   * Adds a new team. Passes on the request to save the new team to the team service. If a team lead is selected, also passes
   * on the request to save the user account's info to the user account service.
   */
  updateTask() {
    let name = (<HTMLInputElement>document.getElementById("task_name")).value;
    let billable = (<HTMLInputElement>document.getElementById("task_is_billable")).checked;

    // validate data
    let nameAvailable: boolean = true;
    if (name === '') {
      alert("The Name of a New Task cannot be empty");
      nameAvailable = false;
    }

    for (let t of this.taskPanelService.tasks) {
      // t != task ensures that we allow a task to keep the same name
      if (name === t.name && t.id !== this.taskPanelService.selectedTask.id) {
        alert("Task name: " + name + " is already taken.");
        nameAvailable = false;
      }
    }

    // save if changes are valid
    if (nameAvailable === true) {
      alert ("change saved");
      this.taskPanelService.selectedTask.name = name;
      this.taskPanelService.selectedTask.billable = billable;
      this.taskPanelService.save(this.taskPanelService.selectedTask);
      this.taskPanelService.destroyAddTaskComponent();
    }
  }

  /**
   * Destroys the dynamically created add team component.
   */
  destroyEditTaskComponent() {
    this.taskPanelService.destroyEditTaskComponent();
  }

}

