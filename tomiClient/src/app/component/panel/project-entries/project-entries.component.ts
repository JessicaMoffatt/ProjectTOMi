import {AfterViewInit, Component, Inject, OnInit, QueryList, ViewChildren} from '@angular/core';
import {EntryApproveComponent} from "../entry-approve/entry-approve.component";
import {DeleteEntryModalComponent} from "../timesheet/timesheet.component";
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from "@angular/material";
import {ApprovePanelComponent} from "../approve-panel/approve-panel.component";
import {Project} from "../../../model/project";
import {ProjectService} from "../../../service/project.service";
import {BehaviorSubject} from "rxjs";
import {Entry} from "../../../model/entry";

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

  /**
   * The currently selected Project.
   */
  selectedProject:Project;

  /**
   * The Entries for the currently selected Project.
   */
  projectEntries:BehaviorSubject<Array<Entry>>;

  /** The entry components references within this project entries component. */
  @ViewChildren(EntryApproveComponent) entryComponentsRef: QueryList<'entryComponentsRef'>;

  /** The list of entry components that are children of this project entries component.*/
  entryComponents: EntryApproveComponent[] = [];

  constructor(public projectService: ProjectService, public dialog: MatDialog,
              @Inject(ApprovePanelComponent) private parent: ApprovePanelComponent) {
  }

  ngOnInit() {
  }

  /** After the view has initialized, gets all entry components.*/
  ngAfterViewInit(): void {
    this.getEntryComponents();
  }

  /**
   * Sets selectedProject to the specified Project.
   * Also retrieves all Entries for this Project.
   * @param project
   */
  async setProject(project:Project){
    this.selectedProject = project;
    this.projectEntries = await this.projectService.getEntries(project);
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
   * Submits the Entries for approval/rejection.
   */
  async submitApproval() {
    await this.projectService.submit(this.entryComponentsRef.toArray());
    this.projectEntries = null;
    this.selectedProject = null;
    this.parent.unselect();
  }
}

// Approval Modal

/**
 * @author Jessica Moffatt
 * @version 1.0
 */
@Component({
  selector: 'app-approval-modal',
  templateUrl: './project-submit.component.html',
  styleUrls: ['./project-submit.component.scss']
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
    await this.data.parent.submitApproval();
  }
}
