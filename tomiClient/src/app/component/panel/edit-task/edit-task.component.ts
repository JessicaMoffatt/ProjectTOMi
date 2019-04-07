import {Component, EventEmitter, Inject, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {FormControl, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material";
import {Task} from 'src/app/model/task';
import {CustomErrorStateMatcher} from "../../extra/CustomErrorStateMatcher";

/**
 * EditUserComponent is used to facilitate communication between the edit task view and front end services.
 *
 * @author Karol Talbot
 * @version 1.1
 */
@Component({
  selector: 'app-edit-task',
  templateUrl: './edit-task.component.html',
  styleUrls: ['./edit-task.component.scss']
})
export class EditTaskComponent implements OnInit {

  /** Validations for the name. */
  taskNameControl = new FormControl('', [
    Validators.required
  ]);

  /** The task model associated with this component. */
  @Input() task: Task;

  /** Event Emitter used to notify the TaskComponent parent that the EditUnitTypeComponent save had been requested. */
  @Output() saveRequested = new EventEmitter<any>();

  /** Event Emitter used to notify the TaskComponent parent that the EditUnitTypeComponent delete had been requested. */
  @Output() deleteRequested = new EventEmitter<any>();

  /** Event Emitter used to notify the TaskComponent parent that the EditUnitTypeComponent cancel had been requested. */
  @Output() cancelRequested = new EventEmitter<any>();

  /** The expansion panel for this task. */
  @ViewChild('editTaskExpansionPanel') editTaskExpansionPanel;

  /** The input field for the Task's name.*/
  @ViewChild('editTaskName') editTaskName;

  /** The input checkbox for the Task's billable status.*/
  @ViewChild('editBillable') editBillable;

  /** The ngForm for this component */
  @ViewChild('editTaskForm') editTaskForm;

  /** Invalid name error detection. */
  taskNameMatcher = new CustomErrorStateMatcher();

  constructor(public deleteTaskDialog: MatDialog) {
  }

  ngOnInit() {

  }

  /**
   * Initialize the value inputs on the template. This fixes issues caused by the Validators.required when an input is pristine.
   */
  setValuesOnOpen() {
    this.taskNameControl.setValue(this.task.name);
    this.editBillable.checked = this.task.billable;
  }

  /**
   * Emits a request for this Task's changes to be saved.
   */
  save(): void {
    if (this.taskNameControl.valid) {
      this.task.name = this.editTaskName.nativeElement.value;
      this.task.billable = this.editBillable.checked;

      this.editTaskExpansionPanel.toggle();
      this.saveRequested.emit(this.task);
    }
  }

  /**
   * Emits a request for this Task to be deleted.
   */
  delete(): void {
    this.editTaskExpansionPanel.toggle();
    this.deleteRequested.emit(this.task);
  }

  /**
   * Emits a request for this Task's changes to be cancelled.
   */
  cancel(): void {
    this.editTaskExpansionPanel.toggle();
  }

  /**
   * Displays a Modal component for deleting the selected Task.
   */
  openDeleteDialog() {
    this.deleteTaskDialog.open(DeleteTaskModal, {
      width: '40vw',
      data: {taskToDelete: this.task, parent: this}
    });
  }
}

// Delete Task Modal

/**
 * DeleteTaskModal is used to get confirmation from the user regarding their desire to delete a Task.
 *
 * @author Karol Talbot
 */
@Component({
  selector: 'app-delete-task-modal',
  templateUrl: './delete-task-modal.html',
  styleUrls: ['./delete-task-modal.scss']
})
export class DeleteTaskModal {

  /**
   * The Task to be deleted.
   */
  taskToDelete: Task;

  constructor(public dialogRef: MatDialogRef<DeleteTaskModal>, @Inject(MAT_DIALOG_DATA) public data: DeleteDialogData) {

  }

  ngOnInit() {
    this.taskToDelete = this.data.taskToDelete;
  }

  /** Closes the modal with no extra actions.*/
  canceledDelete(): void {
    this.dialogRef.close();
  }

  /** Facilitates the deletion of the selected Task, as well as closes the modal.*/
  confirmedDelete() {
    this.data.parent.delete();
    this.dialogRef.close();
  }
}

/** Data interface for the DeleteTaskModal */
export interface DeleteDialogData {
  taskToDelete: Task;
  parent: EditTaskComponent;
}


