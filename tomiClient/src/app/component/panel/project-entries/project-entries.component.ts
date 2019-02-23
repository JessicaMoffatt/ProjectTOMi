import {AfterViewInit, Component, OnInit, QueryList, ViewChildren} from '@angular/core';
import {ProjectEntriesService} from "../../../service/project-entries.service";
import {SubmitTimesheetModalComponent, TimesheetComponent} from "../timesheet/timesheet.component";
import {BsModalRef, BsModalService} from "ngx-bootstrap";
import {Router} from "@angular/router";
import {TimesheetService} from "../../../service/timesheet.service";
import {ProjectService} from "../../../service/project.service";
import {EntryService} from "../../../service/entry.service";
import {EntryComponent} from "../entry/entry.component";
import {EntryApproveComponent} from "../entry-approve/entry-approve.component";

@Component({
  selector: 'app-project-entries',
  templateUrl: './project-entries.component.html',
  styleUrls: ['./project-entries.component.scss']
})
export class ProjectEntriesComponent implements OnInit, AfterViewInit {
  /** The reference to the BSModal, which is used to show either the delete modal or the submit modal.*/
  bsModalRef: BsModalRef;

  @ViewChildren(EntryApproveComponent) entryComponentsRef: QueryList<'entryComponentsRef'>;
  entryComponents: EntryApproveComponent[] = [];

  constructor(public projectEntriesService: ProjectEntriesService, private modalService: BsModalService, private router: Router, public timesheetService: TimesheetService, private projectService: ProjectService, private entryService: EntryService) {
  }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    this.getEntryComponents();
  }

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
    const initialState = {
      title: 'Submit Confirmation',
      parent: this
    };

    this.bsModalRef = this.modalService.show(SubmitApprovalModalComponent, {initialState});
  }

  async submitApproval() {
    // await this.projectEntriesService.submit().finally(() => {
    //   this.projectEntriesService.displayProjectEntries().then();
    // });
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
    <div class="modal-header">
      <h4 class="modal-title pull-left">{{title}}</h4>
      <button type="button" class="close pull-right" aria-label="Close" (click)="bsModalRef.hide()">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="modal-body">
      <span>Confirm SUBMISSION of APPROVAL/REJECTION for entries</span>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-default" [ngClass]="'confirm_btn'" (click)="confirmSubmission()">SUBMIT
      </button>
      <button type="button" class="btn btn-default" [ngClass]="'cancel_btn'" (click)="cancel()">CANCEL</button>
    </div>
  `
})

/**
 * SubmitTimesheetModalComponent is used to get confirmation from the user regarding their desire to submit a timesheet.
 */
export class SubmitApprovalModalComponent implements OnInit {
  /** The title of the modal.*/
  title: string;
  /** The parent component which is showing this modal.*/
  parent: ProjectEntriesComponent;

  constructor(public bsModalRef: BsModalRef) {
  }

  ngOnInit() {

  }

  /** Facilitates the submission of the current timesheet, as well as closes the modal.*/
  confirmSubmission(): void {
    this.submitApproval();
    this.bsModalRef.hide();
  }

  /** Closes the modal with no extra actions.*/
  cancel(): void {
    this.bsModalRef.hide();
  }


  /** Facilitates submission of the current timesheet.**/
  async submitApproval() {
    await this.parent.submitApproval().then(()=>{
      // console.log(this.parent.projectEntriesService.count);
      this.test().then(()=>{
        // console.log(this.parent.projectEntriesService.count);
      });

    });
  }

  async test(){
    await this.parent.projectEntriesService.displayProjectEntries().then();
  }
}
