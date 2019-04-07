import {
  AfterViewInit,
  Component, HostListener, Inject,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
  ViewContainerRef
} from '@angular/core';
import {Entry} from "../../../model/entry";
import {TimesheetService} from "../../../service/timesheet.service";
import {ProjectService} from "../../../service/project.service";
import {EntryService} from "../../../service/entry.service";
import {Timesheet} from "../../../model/timesheet";
import {EntryComponent} from "../entry/entry.component";
import {Status} from "../../../model/status";
import {Router} from "@angular/router";
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from "@angular/material";
import {SignInService} from "../../../service/sign-in.service";
import {ErrorService} from "../../../service/error.service";

/**
 *
 *  @author Jessica Moffatt
 */
export interface DialogData {
  entry: Entry;
  parent: TimesheetComponent;
}

/**
 * TimesheetComponent is used to facilitate communication between the timesheet view and front end services.
 *
 * @author Karol Talbot
 * @author Jessica Moffatt
 * @version 2.0
 */
@Component({
  selector: 'app-timesheet',
  templateUrl: './timesheet.component.html',
  styleUrls: ['./timesheet.component.scss']
})
export class TimesheetComponent implements OnInit, AfterViewInit {

  /** The ID of the user of this application.*/
  private userId = this.signInService.userAccount.id;

  /** List of all Entries for current Timesheet.*/
  entries: Entry[] = [];

  /**
   * Holds the total number of hours worked this week.
   */
  tally: number = 0;

  /** A Status; used to compare against the status of the Timesheet.*/
  sts = Status;

  /** A view container ref for the template that will be used to house the entry component.*/
  @ViewChild('entryHolder', {read: ViewContainerRef}) entry_container: ViewContainerRef;

  /** The entry components references within this timesheet component. */
  @ViewChildren(EntryComponent) entryComponentsRef: QueryList<'entryComponentsRef'>;

  /** The list of entry components that are children of the timesheet.*/
  entryComponents: EntryComponent[] = [];

  /**
   * Listens for the Enter key's keyup event; Performs a save on that event.
   * @param e The event captured.
   */
  @HostListener('window:keyup.Enter', ['$event']) enter(e: KeyboardEvent) {
    this.savePromise().then();
  }

  constructor(private router: Router, public timesheetService: TimesheetService,
              private projectService: ProjectService, private entryService: EntryService,
              public dialog: MatDialog, private signInService: SignInService,
              private errorService: ErrorService) {

  }

  ngOnInit() {
    if (this.timesheetService.timesheets.length === 0) {
      this.firstLoad();
    }else{
      if(this.timesheetService.getRepopulateTimesheets()){
        this.timesheetService.setRepopulateTimesheets(false);

        this.populateProjects(this.userId);

        this.populateTimesheets().then(()=>{
          this.timesheetService.getCurrentTimesheet().then(data=>{
          this.getEntries(data);
        });})
      }else{
        this.timesheetService.getCurrentTimesheet().then(data=>{
          this.getEntries(data);
        });
      }
    }
  }

  /** After the view has initialized, gets all entry components.*/
  ngAfterViewInit(): void {
    this.getEntryComponents();
  }

  /**
   * Populates the Timesheets for the user as well as getting the list of tasks and unit types.
   */
  firstLoad() {
    this.populateTimesheets().then((value) => {
      let timesheet = value as Timesheet;
      this.getEntries(timesheet);
      this.populateProjects(this.userId);
      this.timesheetService.populateTasks().then();
      this.timesheetService.populateUnitTypes().then();
    });
  }

  /** Gets all the entry components currently on the Timesheet.*/
  getEntryComponents() {
    this.entryComponentsRef.changes.subscribe(c => {
      c.toArray().forEach(item => {
        this.entryComponents.push(item);
      });
    });
  }

  /** Populates the list of Timesheets.*/
  async populateTimesheets() {
    let promise = new Promise((resolve) => {
      resolve(this.timesheetService.populateTimesheets(this.userId))
    });

    return await promise;
  }

  /**
   * Gets all entries for this timesheet.
   * @param id The ID of the timesheet we want the entries of.
   */
  getEntries(timesheet: Timesheet) {
    this.timesheetService.getEntries(timesheet).subscribe((data) => {
      this.entries = data;
      this.updateTally();
      this.timesheetService.setCurrentStatus().then();
      this.timesheetService.setCurrentDate();
    });
  }

  /**
   * Gets all projects this user is associated with.
   * @param id The ID of the user.
   */
  populateProjects(id: number): void {
    this.projectService.getProjectsForUser(id).subscribe((data => this.timesheetService.projects = data));
  }

  /**
   * Creates an empty entry for the timesheet.
   */
  public addEntry(): void {
    if ((this.timesheetService.currentStatus === this.sts[this.sts.LOGGING]) || (this.timesheetService.currentStatus === this.sts[this.sts.REJECTED])) {
      let newEntry = new Entry();

      this.timesheetService.getCurrentTimesheet().then((data) => {
        newEntry.timesheet = data;

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
    const dialogRef = this.dialog.open(DeleteEntryModalComponent, {
      width: '40wv',
      data: {entry: entry, parent: this}
    });

    dialogRef.afterClosed().subscribe(result => {
    })
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
   * Checks for validity of all entries for this timesheet before passing off the request to save to the
   * entry service.
   */
  async submitTimesheet() {
     await this.savePromise().then(async()=>{
      let valid: boolean = false;
      this.entryComponents.forEach(item => {
        valid = item.validateEntry();
      });

      if (valid) {
        await this.timesheetService.submit().then((data:Timesheet) => {
          let promise = new Promise((resolve)=>{
            resolve(this.timesheetService.updateTimesheet(data))
          }).then(()=>{
            this.reloadPromise().then();
          });

          promise.then();
        });
      } else if (!valid) {
        this.errorService.displayErrorMessage("All fields need a value to submit the timesheet.");
      }
      }
    );
  }

  /**
   * Waits for reloadAfterSetCurrentStatus to compelete.
   */
  async reloadPromise() {
    let promise = new Promise((resolve) => {
      resolve(this.reloadAfterSetCurrentStatus());
    });

    return await promise;
  }

  /**
   * Reloads the page once setCurrentStatus has completed.
   */
  async reloadAfterSetCurrentStatus() {
    await this.setCurrentStatusPromise().then((data) => {
        this.navigateToTimesheet();
      }
    );
  }

  /**
   * Navigates to the timesheets page.
   */
  navigateToTimesheet() {
    this.router.navigateByUrl('/', {skipLocationChange: true}).finally(() =>
      this.router.navigate(["/my_timesheets"]));
  }

  /**
   * Waits for setCurrentStatus to complete.
   */
  async setCurrentStatusPromise() {
    let promise = new Promise((resolve) => {
      resolve(this.timesheetService.setCurrentStatus());
    });

    return await promise;
  }

  /**
   * Waits for save to complete.
   */
  async savePromise() {
    let promise = new Promise((resolve, reject) => {
      resolve(this.save());
    });

    return await promise;
  }

  /**
   * Saves the state of all entries for the current timesheet.
   */
  async save() {
    if ((this.timesheetService.currentStatus === this.sts[this.sts.LOGGING]) || (this.timesheetService.currentStatus === this.sts[this.sts.REJECTED])) {
      return Promise.all(this.entryComponents.map((comp) => {
        return Promise.resolve(comp.save()).then(() => {
          this.updateTally();
        });
      }));
    }
  }

  /**
   * Displays the submit modal.
   */
  displaySubmitModal() {
    if ((this.timesheetService.currentStatus === this.sts[this.sts.LOGGING]) || (this.timesheetService.currentStatus === this.sts[this.sts.REJECTED])) {
      const dialogRef = this.dialog.open(SubmitTimesheetModalComponent, {
        width: '400px',
        data: {parent: this}
      });

      dialogRef.afterClosed().subscribe(result => {
      })
    }
  }

  /**
   * Updates the tally for the total worked hours for the Timesheet.
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

  /**
   * Changes the Timesheet to display to the sequentially previous timesheet.
   */
  displayPrevTimesheet() {
    let currentIndex = this.timesheetService.getCurrentTimesheetIndex();

    if (currentIndex < this.timesheetService.timesheets.length - 1) {
      let newIndex: number = currentIndex + 1;
      this.timesheetService.setCurrentTimesheetIndex(newIndex).then(() => {
          this.navigateToTimesheet();
        }
      );
    }
  }

  /**
   * Changes the Timesheet to display to the sequentially next timesheet.
   */
  displayNextTimesheet() {
    let currentIndex = this.timesheetService.getCurrentTimesheetIndex();

    if (currentIndex > 0) {
      let newIndex: number = currentIndex - 1;
      this.timesheetService.setCurrentTimesheetIndex(newIndex).then(() => {
          this.navigateToTimesheet();
        }
      );
    }
  }

  /**
   * Changes the Timesheet to display to the Timesheet at the specified index within timesheets.
   * @param index The index of the Timesheet to display.
   */
  displaySpecifiedTimesheet(index: number) {
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

// Delete Modal

/**
 * @author Jessica Moffatt
 * @version 1.0
 */
@Component({
  selector: 'app-delete-modal',
  templateUrl: './delete-entry-modal.html',
  styleUrls: ['./delete-entry-modal.scss']
})

/**
 * DeleteEntryModalComponent is used to get confirmation from the user regarding their desire to delete an Entry.
 *
 * @author Jessica Moffatt
 * @version 1.0
 */
export class DeleteEntryModalComponent implements OnInit {

  constructor(private entryService: EntryService, public dialogRef: MatDialogRef<DeleteEntryModalComponent>,
              @Inject(MAT_DIALOG_DATA) public data: DialogData) {
  }

  ngOnInit() {

  }

  /** Facilitates the deletion of the Entry, as well as closes the modal.*/
  confirmDelete(): void {
    this.deleteEntry();
    this.dialogRef.close();
  }

  /** Closes the modal with no extra actions.*/
  cancelDelete(): void {
    this.dialogRef.close();
  }

  /** Facilitates deletion on the backend as well as the front end.**/
  deleteEntry() {
    this.entryService.delete(this.data.entry);
    this.data.parent.deleteEntry(this.data.entry);
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


    <h1 mat-dialog-title>Submit Timesheet</h1>
    <div mat-dialog-content>
      <p>Confirm submission of Timesheet</p>
      <button mat-button [ngClass]="'manage_cancel_btn'" (click)="cancel()">Cancel</button>
      <button mat-button [ngClass]="'modal_submit'" (click)="confirmSubmission()">Submit</button>
    </div>
  `,
  styleUrls: ['./delete-entry-modal.scss']
})

/**
 * SubmitTimesheetModalComponent is used to get confirmation from the user regarding their desire to submit a Timesheet.
 */
export class SubmitTimesheetModalComponent implements OnInit {
  constructor(public dialogRef: MatDialogRef<DeleteEntryModalComponent>,
              @Inject(MAT_DIALOG_DATA) public data: DialogData) {
  }

  ngOnInit() {

  }

  /** Facilitates the submission of the current timesheet, as well as closes the modal.*/
  confirmSubmission(): void {
    this.submitTimesheet();
    this.dialogRef.close();
  }

  /** Closes the modal with no extra actions.*/
  cancel(): void {
    this.dialogRef.close();
  }

  /** Facilitates submission of the current timesheet.**/
  submitTimesheet() {
    this.data.parent.submitTimesheet().then();
  }
}
