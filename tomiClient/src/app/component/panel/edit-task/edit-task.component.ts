import {Component, EventEmitter, Inject, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {FormControl, Validators} from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material";
import {Task} from 'src/app/model/task';
import {TaskService} from "../../../service/task.service";

/**
 * EditUserComponent is an individual, editable entry for a Task.
 *
 * @author Karol Talbot
 * @version 1.1
 */
@Component({
  selector: 'app-edit-task',
  templateUrl: './edit-task.component.html',
  styleUrls: ['./edit-task.component.scss']
})
export class EditTaskComponent implements OnInit, OnDestroy {

  /** Validations for the name. */
  taskNameControl = new FormControl('', [
    Validators.required
  ]);

  /** The taskSubject model associated with this component. */
  @Input() task: Task;
  /** Event Emitter used to notify the TaskComponent parent that the EditTaskComponent save had been requested. */
  @Output() saveRequested = new EventEmitter<any>();
  /** Event Emitter used to notify the TaskComponent parent that the EditTaskComponent delete had been requested. */
  @Output() deleteRequested = new EventEmitter<any>();
  /** Event Emitter used to notify the TaskComponent parent that the EditTaskComponent cancel had been requested. */
  @Output() cancelRequested = new EventEmitter<any>();

  /** The expansion panel for this taskSubject. */
  @ViewChild('editTaskExpansionPanel') editTaskExpansionPanel;

  /** The input field for the Task's name.*/
  @ViewChild('editTaskName') editTaskName;

  /** The input checkbox for the Task's billable status.*/
  @ViewChild('editBillable') editBillable;

  /** The ngForm for this component */
  @ViewChild('editTaskForm') editTaskForm;


  constructor(public deleteTaskDialog: MatDialog) {
  }

  ngOnInit() {

  }

  ngOnDestroy(): void {

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
  save():void {
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
  delete():void {
    this.editTaskExpansionPanel.toggle();
    this.deleteRequested.emit(this.task);
  }

  /**
   * Emits a request for this Task's changes to be cancelled.
   */
  cancel():void {
    this.editTaskExpansionPanel.toggle();
  }

  openDeleteDialog() {
    this.deleteTaskDialog.open(DeleteTaskModal, {
      width: '40vw',
      data: {taskToDelete: this.task, parent: this}
    });
  }
}

@Component({
  selector: 'app-delete-task-modal',
  templateUrl: './delete-task-modal.html',
  styleUrls: ['./delete-task-modal.scss']
})
/** Inner class for confirmation modal of delete Task. */
export class DeleteTaskModal {
  taskToDelete: Task;

  constructor(public dialogRef: MatDialogRef<DeleteTaskModal>, @Inject(MAT_DIALOG_DATA) public data: DeleteDialogData) {

  }

  ngOnInit() {
    this.taskToDelete = this.data.taskToDelete;
  }

  canceledDelete(): void {
    this.dialogRef.close();
  }

  confirmedDelete() {
    this.data.parent.delete();
    this.dialogRef.close();
  }
}

/** Data interface for the DeleteTaskModal */
export interface DeleteDialogData {
  taskToDelete : Task;
  parent: EditTaskComponent;
}


