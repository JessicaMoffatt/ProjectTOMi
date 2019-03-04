import {AfterViewInit, Component, Inject, OnInit, QueryList, ViewChildren} from '@angular/core';
import {ProjectEntriesService} from "../../../service/project-entries.service";
import {EntryApproveComponent} from "../entry-approve/entry-approve.component";
import {DeleteEntryModalComponent, TimesheetComponent} from "../timesheet/timesheet.component";
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from "@angular/material";

export interface DialogData {
  parent: ProjectEntriesComponent;
}

/**
 * ProjectEntriesComponent is used to facilitate communication between the view and front end services.
 *
 * @author Jessica Moffatt
 * @version 1.0
 */
@Component({
  selector: 'app-project-entries',
  templateUrl: './project-entries.component.html',
  styleUrls: ['./project-entries.component.scss']
})
export class ProjectEntriesComponent implements OnInit, AfterViewInit {

  @ViewChildren(EntryApproveComponent) entryComponentsRef: QueryList<'entryComponentsRef'>;
  entryComponents: EntryApproveComponent[] = [];

  constructor(public projectEntriesService: ProjectEntriesService, public dialog: MatDialog) {
  }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    this.getEntryComponents();
  }

  /**
   * Gets the entries to be displayed for approval.
   */
  getEntryComponents() {
    this.entryComponentsRef.changes.subscribe(c => {
      c.toArray().forEach(item => {
        this.entryComponents.push(item);
      });
    });
  }

  /**
   * Displays the submit modal.
   */
  displaySubmitModal() {
    const dialogRef = this.dialog.open(SubmitApprovalModalComponent, {
      width: '400px',
      data: {parent: this}
    });

    dialogRef.afterClosed().subscribe(result => {
    })
  }

  /**
   * Submits the entries for approval/rejection.
   */
  async submitApproval() {
    let promise = new Promise((resolve,reject)=>{
      resolve(this.projectEntriesService.submit());
    });

    return await promise;
  }
}

/* Approval Modal */
/**
 * @author Jessica Moffatt
 * @version 1.0
 */
@Component({
  selector: 'app-approval-modal',
  template: `

    <h1 mat-dialog-title>Submit Timesheet</h1>
    <div mat-dialog-content>
      <p>Confirm SUBMISSION of APPROVAL/REJECTION for entries</p>
      <button mat-button [ngClass]="'confirm_button'" (click)="confirmSubmission()">SUBMIT</button>
      <button mat-button [ngClass]="'cancel_btn'" (click)="cancel()">CANCEL</button>
    </div>
  `
})

/**
 * SubmitApprovalModalComponent is used to get confirmation from the user regarding their desire to submit entries for approval.
 */
export class SubmitApprovalModalComponent implements OnInit {
  constructor(public dialogRef: MatDialogRef<DeleteEntryModalComponent>,
              @Inject(MAT_DIALOG_DATA) public data: DialogData) {
  }

  ngOnInit() {

  }

  /** Facilitates the submission of the current timesheet, as well as closes the modal.*/
  confirmSubmission(): void {
    this.submitApproval().then();
    this.dialogRef.close();
  }

  /** Closes the modal with no extra actions.*/
  cancel(): void {
    this.dialogRef.close();
  }


  /** Facilitates submission of the current timesheet.**/
  async submitApproval() {
    await this.data.parent.submitApproval().then(()=>{
      this.displayProjectEntries().then();
    });
  }

  /**
   * Displays the project's entries.
   */
  async displayProjectEntries(){
    await this.data.parent.projectEntriesService.displayProjectEntries().then();
  }
}
