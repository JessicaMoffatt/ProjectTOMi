import {
  Component,
  ChangeDetectorRef,
  ComponentFactoryResolver,
  Input,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import {TaskPanelService} from "../../../service/task-panel.service";
import {Task} from "../../../model/task";
import {AddTaskComponent} from "../../modal/add-task/add-task.component";
import {EditTaskComponent} from "../../modal/edit-task/edit-task.component";

/**
 * Tasks is used to facilitate communication between the view and front end services.
 *
 * Note: confirmation box for delete() must be styled
 *
 * @author James Andrade
 * @version 1.0
 */

@Component({
  selector: 'app-tasks-panel',
  templateUrl: './tasks-panel.component.html',
  styleUrls: ['./tasks-panel.component.scss', '../../../app.component.scss']
})

export class TasksPanelComponent implements OnInit{

  /** A view container ref for the template that will be used to house the add task member component. */
  @Input() @ViewChild('add_task_container', {read: ViewContainerRef})
  add_task_container: ViewContainerRef;

  /** A view container ref for the template that will be used to house the edit task member component. */
  @Input() @ViewChild('edit_task_container', {read: ViewContainerRef})
  edit_task_container: ViewContainerRef;

  constructor(private ref: ChangeDetectorRef, private resolver: ComponentFactoryResolver, public taskPanelService: TaskPanelService) {
  }

  ngOnInit() {
  }

  /**
   * Dynamically creates the add-task component, which will be housed in the template with the id of 'add_task_container'.
   */
  createAddTaskComponent() {
    this.add_task_container.clear();
    const factory = this.resolver.resolveComponentFactory(AddTaskComponent);
    this.taskPanelService.ref = this.add_task_container.createComponent(factory);
  }

  /**
   * Dynamically creates the edit-task component, which will be housed in the template with the id of 'edit_task_container'.
   */
  createEditTaskComponent(task: Task) {
    this.taskPanelService.setSelectedTask(task);
    this.edit_task_container.clear();
    const factory = this.resolver.resolveComponentFactory(EditTaskComponent);
    this.taskPanelService.ref = this.edit_task_container.createComponent(factory);
  }

  /**
   * Changes the billable status of a task to the opposite of it's current value
   * @param task the task for which the billable status is to be toggled
   */
  toggleBillable(task: Task) {
    task.billable = !task.billable;
    this.taskPanelService.save(task);
  }

  /**
   * deletes the provided task via TaskPanelService
   * @param task the task to be deleted
   */
  delete(task: Task) {
    if (confirm("Delete " + task.name + " ?")) {
      this.taskPanelService.delete(task);
    }
  }
}
