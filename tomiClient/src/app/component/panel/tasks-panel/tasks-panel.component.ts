
import {Component, ComponentFactoryResolver, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {TaskPanelService} from "../../service/task-panel.service";
import {Task} from "../../model/task";

import {UserAccount} from "../../model/userAccount";
import {AddTaskComponent} from "../add-task/add-task.component";
import {Team} from "../../model/team";

// import {AddTaskComponent} from "../add-team-member/add-task.component";

/**
 * Tasks is used to facilitate communication between the view and front end services.
 *
 * @author James Andrade
 * @version 1.0
 */

@Component({
  selector: 'app-tasks-panel',
  templateUrl: './tasks-panel.component.html',
  styleUrls: ['./tasks-panel.component.css','../../app.component.css']
})

export class TasksPanelComponent implements OnInit {

  /** A view container ref for the template that will be used to house the add task member component. */
   @ViewChild('add_task_container', {read: ViewContainerRef})
   add_task_container: ViewContainerRef;

  constructor(private resolver: ComponentFactoryResolver, public taskPanelService: TaskPanelService) { }

  ngOnInit() {
    this.taskPanelService.getAllTasks().subscribe((data: Array<Task>) => {
      this.taskPanelService.tasks = data;
    });
  }


  /**
   * Sets the selected team member.
   * @param account The user account whom has been selected.
   */
  setSelectedTask(task: Task) {
    this.taskPanelService.setSelectedTask(task);
  }

  /**
   * Removes the selected member from the team.

  removeMember() {
    this.teamService.removeMember();
  }
*/

  /**
   * Dynamically creates the task component, which will be housed in the template with the id of 'add_team_member_container'.
  */
  createAddTaskComponent() {
    this.add_task_container.clear();
    const factory = this.resolver.resolveComponentFactory(AddTaskComponent);
    this.taskPanelService.ref = this.add_task_container.createComponent(factory);
  }

  /**
   * Passes on the request to save a given team to the team service.
   *
   * @param team The team to be saved.

  save(team: Team) {
    team.teamName = (<HTMLInputElement>document.getElementById("team_name")).value;
    let leadId = Number((<HTMLInputElement>document.getElementById("selected_team_lead")).value);
    team.leadId = leadId;
    this.teamService.save(team).then();
  } */

  /**
   * Passes on the request to delete a given team to the team service.
   * @param team The team to be deleted.

  delete(team: Team) {
    this.teamService.delete(team);
  } */

}
