import {
  AfterViewInit,
  Component,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
  ViewContainerRef
} from '@angular/core';
import {Entry} from "../../../model/entry";
import {TimesheetService} from "../../../service/timesheet.service";
import {ProjectService} from "../../../service/project.service";
import {Project} from "../../../model/project";
import {EntryService} from "../../../service/entry.service";
import {Timesheet} from "../../../model/timesheet";
import {EntryComponent} from "../entry/entry.component";
import {Status} from "../../../model/status";
import {Router} from "@angular/router";
import {BsModalRef, BsModalService} from "ngx-bootstrap";


/**
 * TimesheetComponent is used to facilitate communication between the view and front end services.
 *
 * @author Jessica Moffatt
 * @version 2.0
 */
@Component({
  selector: 'app-timesheet',
  templateUrl: './timesheet.component.html',
  styleUrls: ['./timesheet.component.scss']
})
export class TimesheetComponent implements OnInit, AfterViewInit {

  /** The reference to the BSModal, which is used to show either the delete modal or the submit modal.*/
  bsModalRef: BsModalRef;
  //TODO, don't hard code
  /** The ID of the user.*/
  private userId = 1;

  /** List of all entries for current timesheet.*/
  entries: Entry[] = [];
  /** List of all projects this user is allowed to access.*/
  projects: Project[] = [];

  /**
   * Holds the total number of hours worked this week.
   */
  tally: number = 0;

  /** A Status; used to compare against the status of the timesheet.*/
  sts = Status;

  /** A view container ref for the template that will be used to house the entry component.*/
  @ViewChild('entryHolder', {read: ViewContainerRef}) entry_container: ViewContainerRef;
  @ViewChildren(EntryComponent) entryComponentsRef: QueryList<'entryComponentsRef'>;

  /** The list of entry components that are children of the timesheet.*/
  entryComponents: EntryComponent[] = [];

  constructor(private modalService: BsModalService, private router: Router, public timesheetService: TimesheetService, private projectService: ProjectService, private entryService: EntryService) {

  }

  /**
   * On initialization, calls getEntries to populate the entries variable as well as the projects variable.
   */
  ngOnInit() {
    this.populateTimesheets().then((value) => {
      let timesheet = value as Timesheet;
      this.getEntries(timesheet.id);
      this.getProjects(this.userId);
    });
  }

  /** After the view has initialized, gets all entry components.*/
  ngAfterViewInit(): void {
    this.getEntryComponents();
  }

  /** Gets all the entry components currently on the timesheet.*/
  getEntryComponents() {
    this.entryComponentsRef.changes.subscribe(c => {
      c.toArray().forEach(item => {
        this.entryComponents.push(item);
      });
    });
  }

  /** Populates the list of timesheets.*/
  async populateTimesheets() {
    let promise = new Promise((resolve, reject) => {
      resolve(this.timesheetService.populateTimesheets(this.userId))
    });

    return await promise;
  }

  /**
   * Gets all entries for this timesheet.
   * @param id The ID of the timesheet we want the entries of.
   */
  getEntries(id: number) {
    this.timesheetService.getEntries(id).subscribe((data) => {
      this.entries = data;
      this.updateTally();
    });
  }

  /**
   * Gets all projects this user is associated with.
   * @param id The ID of the user.
   */
  getProjects(id: number): void {
    this.projectService.getProjectsForUser(id).subscribe((data => this.projects = data));
  }

  /**
   * Creates an empty entry for the timesheet.
   */
  public addEntry(): void {
    if (this.timesheetService.currentStatus === this.sts[this.sts.LOGGING]) {
      let newEntry = new Entry();

      this.timesheetService.getCurrentTimesheet().then((data) => {
        newEntry.timesheet = data.id;

        this.entryService.save(newEntry).then((data => {
          this.entries.push(data);
          this.entryComponents = [];
        }));
      });
    }
  }

  /**
   * Duplicates an entry.
   * @param entry The entry to duplicate.
   */
  copyEntry(entry: Entry): void {
    this.entryService.copy(entry).then(
      (data) => {
        this.entries.push(data);
      }
    );

    this.entryComponents = [];
  }

  /**
   * Displays the modal for deleting an entry from the timesheet.
   * @param entry The entry to be deleted.
   */
  displayDeleteEntryModal(entry: Entry) {
    const initialState = {
      title: 'Delete Confirmation',
      entry: entry,
      parent: this
    };

    this.bsModalRef = this.modalService.show(DeleteEntryModalComponent, {initialState});
  }

  /**
   * Deletes the specified entry.
   * @param entry The entry to be deleted.
   */
  public deleteEntry(entry: Entry) {
    let index = this.entries.indexOf(entry);
    this.entries.splice(index, 1);

    this.entryComponents = [];

    this.updateTally();
  }

  /**
   * Submits the current timesheet.
   */
  async submitTimesheet() {
     await this.savePromise().then(async()=>{
      let valid: boolean = false;
      this.entryComponents.forEach(item => {
        valid = item.validateEntry();
        if (!valid) {
          return;
        }
      });

      if (valid) {
        await this.timesheetService.submit().then(() => {
          this.reloadPromise().then();
        });
      } else if (!valid) {
        alert("All fields must have a value to submit!");
      }
      }
    );
  }

  /**
   * Waits for reloadAfterSerCurrentStatus to compelte.
   */
  async reloadPromise() {
    let promise = new Promise((resolve, reject) => {
      resolve(this.reloadAfterSetCurrentStatus());
    });

    return await promise;
  }

  /**
   * Reloads the page once setCurrentStatus has completed.
   */
  async reloadAfterSetCurrentStatus() {
    await this.setCurrentStatusPromise().finally(() => {
        this.navigateToTimesheet();
      }
    );
  }

  navigateToTimesheet() {
    this.router.navigateByUrl('/', {skipLocationChange: true}).finally(() =>
      this.router.navigate(["/timesheetPanel"]));
  }

  /**
   * Waits for setCurrentStatus to complete.
   */
  async setCurrentStatusPromise() {
    let promise = new Promise((resolve, reject) => {
      resolve(this.timesheetService.setCurrentStatus());
    });

    return await promise;
  }

  async savePromise(){
    let promise = new Promise((resolve, reject) => {
      resolve(this.save());
    });

    return await promise;
  }

  /**
   * Saves the state of all entries for the current timesheet.
   */
  async save() {
    if (this.timesheetService.currentStatus === this.sts[this.sts.LOGGING]) {
      return Promise.all(this.entryComponents.map((comp)=> {
          return Promise.resolve(comp.save()).then(() => {
          this.updateTally();
        });
      }));
      //TODO remove
      alert("Save complete");
    }
  }

  /**
   * Displays the submit modal.
   */
  displaySubmitModal() {
    if (this.timesheetService.currentStatus === this.sts[this.sts.LOGGING]) {
      const initialState = {
        title: 'Submit Confirmation',
        parent: this
      };

      this.bsModalRef = this.modalService.show(SubmitTimesheetModalComponent, {initialState});
    }
  }

  /**
   * Updates the tally for the total worked hours for the timesheet.
   */
  public updateTally(): void {
    let hours: number = 0;
    this.entries.forEach(function (entry) {
      hours += +entry.mondayHours + +entry.tuesdayHours + +entry.wednesdayHours + +entry.thursdayHours + +entry.fridayHours + +entry.saturdayHours + +entry.sundayHours;
    });

    this.tally = hours;
  }

  /**
   * Gets the number value of the string that matches in the Status enum.
   * Used for comparison purposes.
   * @param statusString String to match to a Status.
   */
  getStatusValue(statusString: string): number {
    for (let item in Status) {
      if (Status[item] === statusString) {
        return parseInt(item);
      }
    }
    return null;
  }

  displayPrevTimesheet() {
    let currentIndex = this.timesheetService.getCurrentTimesheetIndex();

    if (currentIndex < this.timesheetService.timesheets.length -1) {
      let newIndex: number = currentIndex + 1;
      this.timesheetService.setCurrentTimesheetIndex(newIndex).then(() => {
          this.navigateToTimesheet();
        }
      );
    }
  }

  displayNextTimesheet(){
    let currentIndex = this.timesheetService.getCurrentTimesheetIndex();

    if (currentIndex > 0) {
      let newIndex: number = currentIndex - 1;
      this.timesheetService.setCurrentTimesheetIndex(newIndex).then(() => {
          this.navigateToTimesheet();
        }
      );
    }
  }

  displaySpecifiedTimesheet(index:number){
    let currentIndex = this.timesheetService.getCurrentTimesheetIndex();
    let newIndex: number = currentIndex + index;

    if (newIndex < this.timesheetService.timesheets.length) {
      this.timesheetService.setCurrentTimesheetIndex(newIndex).then(() => {
          this.navigateToTimesheet();
        }
      );
    }
  }
}

/* Delete Modal */

/**
 * @author Jessica Moffatt
 * @version 1.0
 */
@Component({
  selector: 'app-delete-modal',
  template: `
    <div class="modal-header">
      <h4 class="modal-title pull-left">{{title}}</h4>
      <button type="button" class="close pull-right" aria-label="Close" (click)="bsModalRef.hide()">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="modal-body">
      <span>Confirm deletion of entry</span>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-default" [ngClass]="'confirm_btn'" (click)="confirmDelete()">DELETE</button>
      <button type="button" class="btn btn-default" [ngClass]="'cancel_btn'" (click)="cancelDelete()">CANCEL</button>
    </div>
  `
})

/**
 * DeleteEntryModalComponent is used to get confirmation from the user regarding their desire to delete an entry.
 *
 * @author Jessica Moffatt
 * @version 1.0
 */
export class DeleteEntryModalComponent implements OnInit {
  /** The title of the modal.*/
  title: string;
  /** The entry to delete if confirmation is obtained.*/
  entry: Entry;
  /** The parent component which is showing this modal.*/
  parent: TimesheetComponent;

  constructor(public bsModalRef: BsModalRef, private entryService: EntryService) {
  }

  ngOnInit() {

  }

  /** Facilitates the deletion of entry, as well as closes the modal.*/
  confirmDelete(): void {
    this.deleteEntry();
    this.bsModalRef.hide();
  }

  /** Closes the modal with no extra actions.*/
  cancelDelete(): void {
    this.bsModalRef.hide();
  }

  /** Facilitates deletion on the backend as well as the front end.**/
  deleteEntry() {
    this.entryService.delete(this.entry);
    this.parent.deleteEntry(this.entry);
  }
}

/* Submit Modal */
/**
 * @author Jessica Moffatt
 * @version 1.0
 */
@Component({
  selector: 'app-submit-modal',
  template: `
    <div class="modal-header">
      <h4 class="modal-title pull-left">{{title}}</h4>
      <button type="button" class="close pull-right" aria-label="Close" (click)="bsModalRef.hide()">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="modal-body">
      <span>Confirm SUBMISSION of timesheet</span>
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
export class SubmitTimesheetModalComponent implements OnInit {
  /** The title of the modal.*/
  title: string;
  /** The parent component which is showing this modal.*/
  parent: TimesheetComponent;

  constructor(public bsModalRef: BsModalRef) {
  }

  ngOnInit() {

  }

  /** Facilitates the submission of the current timesheet, as well as closes the modal.*/
  confirmSubmission(): void {
    this.submitTimesheet();
    this.bsModalRef.hide();
  }

  /** Closes the modal with no extra actions.*/
  cancel(): void {
    this.bsModalRef.hide();
  }


  /** Facilitates submission of the current timesheet.**/
  submitTimesheet() {
    this.parent.submitTimesheet().then();
  }
}
