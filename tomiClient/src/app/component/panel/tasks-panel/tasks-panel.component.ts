import {Component} from '@angular/core';
import {Input} from '@angular/core';
import {OnInit} from '@angular/core';
import {ViewChild} from "@angular/core";
import {ElementRef} from "@angular/core";
import {TaskService} from '../../../service/task.service';
import {Task} from '../../../model/task';
import {Observable} from 'rxjs';
import {MatDialog} from '@angular/material';
import {AddTaskComponent} from '../../modal/add-task/add-task.component';

/**
 *
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

  private task: Task;

  @Input() taskSelectedEvent: Observable<Task>;

  @ViewChild('editTaskComponent') editTaskComponent : ElementRef;

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
   *
   * @param Task
   */
  save(task: Task) {
    this.taskService.save(task);
  }

  /**
   * Displays a Modal component for adding a new Task.
   */
  openDialog(): void {
    this.dialog.open(AddTaskComponent, {
      width: "70vw",
      height: "70vh"
    });
  }
  
}
