import {Component, HostListener, Pipe, PipeTransform} from '@angular/core';
import {OnInit} from '@angular/core';
import {ViewChild} from "@angular/core";
import {ElementRef} from "@angular/core";
import {TaskService} from '../../../service/task.service';
import {Task} from '../../../model/task';
import {MatDialog} from '@angular/material';
import {AddTaskComponent} from '../../modal/add-task/add-task.component';

/**
 * TasksPanelComponent is used to facilitate communication between the view and front end services.
 *
 * @author Karol Talbot
 * @version 2.0
 */
@Component({
  selector: 'app-tasks-panel',
  templateUrl: './tasks-panel.component.html',
  styleUrls: ['./tasks-panel.component.scss']
})
export class TasksPanelComponent implements OnInit{

  /**
   * The task being viewed.
   */
  private task: Task;

  /**
   *  The edit task component within this tasks panel component.
   */
  @ViewChild('editTaskComponent') editTaskComponent : ElementRef;

  /**
   * Listens for the Ctrl+f key's keydown event; Moves focus to the search bar on that event.
   * @param e The event captured.
   */
  @HostListener('window:keydown.Control.f', ['$event']) w(e: KeyboardEvent) {
    e.preventDefault();
    document.getElementById("task_search").focus();
  }

  constructor(private dialog: MatDialog, private taskService: TaskService) { }

  ngOnInit() {
    this.taskService.initializeTasks();
  }

  /**
   * Passes on the request to delete a Task to the TaskService.
   * @param task Task to be deleted.
   */
  delete(task: Task) {
    this.taskService.delete(task);
  }

  /**
   * Passes on the request to save a Task to the TaskService.
   * @param task Task to be saved.
   */
  save(task: Task) {
    this.taskService.save(task);
  }

  /**
   * Displays a Modal component for adding a new Task.
   */
  openDialog(): void {
    this.dialog.open(AddTaskComponent, {
      width: "70vw"
    });
  }
  
}

/**
 * Pipe used to filter Tasks by their name.
 */
@Pipe({name: 'FilterTaskByName'})
export class FilterTaskByName implements PipeTransform {
  transform(taskList: Array<Task>, nameFilter: string): any {
    nameFilter = nameFilter.toLowerCase();
    if (!nameFilter) return taskList;

    return taskList.filter(n => {
      let name = n.name;
      name = name.toLowerCase();

      return name.indexOf(nameFilter) >= 0;
    });
  }
}
