import {
  AfterViewInit,
  Component,
  OnInit, QueryList, ViewChild, ViewChildren, ViewContainerRef
} from '@angular/core';
import {Entry} from "../../../model/entry";
import {TimesheetService} from "../../../service/timesheet.service";
import {ProjectService} from "../../../service/project.service";
import {Project} from "../../../model/project";
import {EntryService} from "../../../service/entry.service";
import {UserAccount} from "../../../model/userAccount";
import {Timesheet} from "../../../model/timesheet";
import {EntryComponent} from "../entry/entry.component";
import {NgForm} from "@angular/forms";

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

  /** List of all entries for current timesheet.*/
  entries: Entry[] = [];
  /** List of all projects this user is allowed to access.*/
  projects: Project[] = [];

  /**
   * Holds the total number of hours worked this week.
   */
  tally: number = 0;

  /** A view container ref for the template that will be used to house the entry component.*/
  @ViewChild('entryHolder', {read: ViewContainerRef}) entry_container: ViewContainerRef;
  @ViewChildren(EntryComponent) thingie: QueryList<'thingie'>;

  entryComponents: EntryComponent[] = [];

  constructor(private timesheetService: TimesheetService, private projectService: ProjectService, private entryService: EntryService) {
  }

  //TODO remove hard coding!
  /**
   * On initialization, calls getEntries to populate the entries variable as well as the projects variable.
   */
  ngOnInit() {
    //TODO remove hard coded number
    this.test().then((value)=>{
      let timesheet = value as Timesheet;
      this.getEntries(timesheet.id);
      this.getProjects(1);
    });
  }

  ngAfterViewInit(): void {
    this.thingie.changes.subscribe(c => {
      c.toArray().forEach(item => {
        this.entryComponents.push(item);
      });
    });
  }

  async test(){
    let promise = new Promise((resolve, reject) => {
      resolve(this.timesheetService.populateTimesheets(1))
    });

    return await promise;
  }

  /**
   * Gets all entries for this timesheet.
   */
  getEntries(id:number): void {
    this.timesheetService.getEntries(id).subscribe((data => this.entries = data));
    // this.updateTally();
  }

  getProjects(id:number): void{
    this.projectService.getProjects(id).subscribe((data => this.projects = data));
  }

  /**
   * Creates an empty entry for the timesheet.
   */
  public addEntry(): void {
    let newEntry = new Entry();

    //TODO, this cannot be hardcoded!!
    let temp = new UserAccount();
    temp.id = 1;
    newEntry.userAccount = temp;
    //TODO get the actual timesheet id
    console.log(this.timesheetService.getCurrentTimesheet());
    newEntry.timesheet = this.timesheetService.getCurrentTimesheet();

    this.entryService.save(newEntry).then( (data => {
      this.entries.push(data)
    }));
  }

  /**
   * Duplicates an entry.
   * @param entry The entry to duplicate.
   */
  copyEntry(entry: Entry): void {
    this.entries.push(entry);
  }

  /**
   * Deletes an entry from the timesheet.
   * @param entry The entry to be deleted.
   */
  deleteEntry(entry: Entry) {
    let index = this.entries.indexOf(entry);
    this.entries.splice(index, 1);

    this.entryService.delete(entry);
  }

  save(){
    this.entryComponents.forEach(item => {
      item.save();
    });
  }

  // /**
  //  * Updates the tally for the total worked hours for the timesheet.
  //  */
  // public updateTally(): void {
  //   //TODO if hours isn't an array need to change this, also change tempentries
  //   let hours = 0;
  //   this.entries.forEach(function (entry) {
  //     entry.hours.forEach(function (hr) {
  //       hours = hours + hr;
  //     })
  //   });
  //
  //   this.tally = hours;
  // }
}
