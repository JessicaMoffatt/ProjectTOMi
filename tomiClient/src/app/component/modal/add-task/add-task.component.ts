import {Component, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroupDirective, NgForm, Validators} from "@angular/forms";
import {MatDialogRef} from "@angular/material";
import {Task} from "../../../model/task";
import {TaskService} from "../../../service/task.service";

/**
 * AddTaskComponent is a modal form used to add a new Task to the back end.
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


  taskNameControl = new FormControl('', [
    Validators.required
  ]);


  @ViewChild('addTaskName') addTaskName;

  /** The input field for the UserAccount's Program Director status. */
  @ViewChild('addTaskBillable') addTaskBillable;

  /** The ngForm for this component */
  @ViewChild('addTaskForm') addTaskForm;

  constructor(public dialogRef: MatDialogRef<AddTaskComponent>, private taskService:TaskService) { }

  /**
   * Closes the modal component.
    */
  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit() {

  }

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
