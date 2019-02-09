import {
  AfterViewInit,
  ChangeDetectorRef,
  Component, EventEmitter,
  OnInit, Output,
  QueryList, TemplateRef,
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
import {BsModalRef, BsModalService, ModalModule} from "ngx-bootstrap";
import {ModalContainerComponent} from "ngx-bootstrap/modal";

/**
 * TimesheetComponent is used to facilitate communication between the view and front end services.
 *
 * @author Jessica Moffatt
 * @version 1.0
 */
@Component({
  selector: 'app-timesheet',
  templateUrl: './timesheet.component.html',
  styleUrls: ['./timesheet.component.scss']
})
export class TimesheetComponent implements OnInit, AfterViewInit{

  bsModalRef: BsModalRef;

  private userId = 1;

  /** List of all entries for current timesheet.*/
  entries: Entry[] = [];
  /** List of all projects this user is allowed to access.*/
  projects: Project[] = [];

  /**
   * Holds the total number of hours worked this week.
   */
  tally: number = 0;

  sts = Status;

  /** A view container ref for the template that will be used to house the entry component.*/
  @ViewChild('entryHolder', {read: ViewContainerRef}) entry_container: ViewContainerRef;
  @ViewChildren(EntryComponent) entryComponentsRef: QueryList<'entryComponentsRef'>;

  entryComponents: EntryComponent[] = [];

  constructor( private modalService: BsModalService, private router: Router, public timesheetService: TimesheetService, private projectService: ProjectService, private entryService: EntryService) {

  }

  //TODO remove hard coding!
  /**
   * On initialization, calls getEntries to populate the entries variable as well as the projects variable.
   */
  ngOnInit() {
    this.populateTimesheets().then((value)=>{
      let timesheet = value as Timesheet;
      this.getEntries(timesheet.id);
      this.getProjects(this.userId);
    });
  }

  ngAfterViewInit(): void {
    this.getEntryComponents();
  }

  getEntryComponents(){
    this.entryComponentsRef.changes.subscribe(c => {
      c.toArray().forEach(item => {
        this.entryComponents.push(item);
      });
    });
  }

  async populateTimesheets(){
    let promise = new Promise((resolve, reject) => {
      resolve(this.timesheetService.populateTimesheets(this.userId))
    });

    return await promise;
  }

  /**
   * Gets all entries for this timesheet.
   */
  getEntries(id:number) {
    this.timesheetService.getEntries(id).subscribe((data) => {
      this.entries = data;
      this.updateTally();
    });
  }

  getProjects(id:number): void{
    this.projectService.getProjectsForUser(id).subscribe((data => this.projects = data));
  }

  /**
   * Creates an empty entry for the timesheet.
   */
  public addEntry(): void {
    if(this.timesheetService.currentStatus === this.sts[this.sts.LOGGING]){
      let newEntry = new Entry();

      this.timesheetService.getCurrentTimesheet().then((data)=>{
        newEntry.timesheet = data.id;

        this.entryService.save(newEntry).then( (data => {
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
   * Deletes an entry from the timesheet.
   * @param entry The entry to be deleted.
   * @param template
   */
  displayDeleteEntryModal(entry: Entry) {
    const initialState = {
      title: 'Delete Confirmation',
      entry: entry,
      parent: this
    };

    this.bsModalRef = this.modalService.show(DeleteEntryModalComponent, {initialState});
  }

  public deleteEntry(entry: Entry){
    let index = this.entries.indexOf(entry);
    this.entries.splice(index, 1);

    this.entryComponents = [];

    this.updateTally();
  }

  public submitTimesheet(){
    let valid:boolean = false;
    this.entryComponents.forEach(item => {
      valid = item.validateEntry();
      if(!valid){
        return;
      }
    });

    if(valid){
      this.timesheetService.submit().then(()=>{
        this.timesheetService.setCurrentStatus().then(()=>{
            this.router.navigateByUrl('/', {skipLocationChange:true}).then(()=>
            this.router.navigate(["/timesheetPanel"]));
          }
        );
      });
    }else if(!valid){
      alert("All fields must have a value to submit!");
    }
  }

  save(){
    if(this.timesheetService.currentStatus === this.sts[this.sts.LOGGING]){
      this.entryComponents.forEach(item => {
        item.save().then(()=>{
          this.updateTally();
        });
      });
      //TODO remove
      alert("Save complete");
    }
  }

  displaySubmitModal(){
    if(this.timesheetService.currentStatus === this.sts[this.sts.LOGGING]){
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
    let hours :number = 0;
    this.entries.forEach(function (entry) {
      hours += +entry.mondayHours + +entry.tuesdayHours + +entry.wednesdayHours + +entry.thursdayHours + +entry.fridayHours + +entry.saturdayHours + +entry.sundayHours;
    });

    this.tally = hours;
  }

  getStatusValue(statusString: string):number{
    for (let item in Status) {
      if (Status[item] === statusString) {
        return parseInt(item);
      }
    }
    return null;
  }

}

/* Delete Modal */

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

export class DeleteEntryModalComponent implements OnInit {
  title: string;
  entry: Entry;
  parent: TimesheetComponent;

  constructor(public bsModalRef: BsModalRef, private entryService: EntryService) {}

  ngOnInit() {

  }

  confirmDelete():void{
    this.deleteEntry();
    this.bsModalRef.hide();
  }

  cancelDelete():void{
    this.bsModalRef.hide();
  }

  //TODO check output of delete, change whether or not to emit
  deleteEntry(){
    this.entryService.delete(this.entry);
    this.parent.deleteEntry(this.entry);
  }
}

/* Submit Modal */
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
      <button type="button" class="btn btn-default" [ngClass]="'cancel_btn'" (click)="cancelDelete()">CANCEL</button>
    </div>
  `
})

export class SubmitTimesheetModalComponent implements OnInit {
  title: string;
  parent: TimesheetComponent;

  constructor(public bsModalRef: BsModalRef) {}

  ngOnInit() {

  }

  confirmSubmission():void{
    this.submitTimesheet();
    this.bsModalRef.hide();
  }

  cancelDelete():void{
    this.bsModalRef.hide();
  }

  //TODO check output of delete, change whether or not to emit
  submitTimesheet(){
    this.parent.submitTimesheet();
  }
}
