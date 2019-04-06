import {Component, OnInit, ViewChild} from '@angular/core';
import {FormControl, Validators} from "@angular/forms";
import {MatDialogRef} from "@angular/material";
import {Task} from "../../../model/task";
import {TaskService} from "../../../service/task.service";

/**
 * AddTaskComponent is used to facilitate communication between the add task view and front end services.
 *
 * @author Karol Talbot
 * @version 2.0
 */
@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.scss']
})
export class AddTaskComponent implements OnInit {

  /** Validations for the task's name. */
  taskNameControl = new FormControl('', [
    Validators.required
  ]);

  /** The input field for the Task's name. */
  @ViewChild('addTaskName') addTaskName;

  /** The input field for the UserAccount's Program Director status. */
  @ViewChild('addTaskBillable') addTaskBillable;

  /** The ngForm for this component */
  @ViewChild('addTaskForm') addTaskForm;

  constructor(public dialogRef: MatDialogRef<AddTaskComponent>, private taskService:TaskService) { }

  ngOnInit() {

  }

  /**
   * Closes this modal component.
   */
  onNoClick(): void {
    this.dialogRef.close();
  }

  /**
   * Passes the request to save a new Task to the TaskService.
   */
  addTask() {
    if (this.taskNameControl.valid) {
      let taskToAdd = new Task();
      taskToAdd.name = this.addTaskName.nativeElement.value;
      taskToAdd.billable = this.addTaskBillable.checked;
      this.taskService.save(taskToAdd);
      this.dialogRef.close();
    }
  }
}
