import {
  Component,
  OnInit, ViewChild, ViewContainerRef
} from '@angular/core';
import {Entry} from "../../../model/entry";
import {TimesheetService} from "../../../service/timesheet.service";
import {ProjectService} from "../../../service/project.service";
import {Project} from "../../../model/project";
import {EntryService} from "../../../service/entry.service";
import {UserAccount} from "../../../model/userAccount";

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
export class TimesheetComponent implements OnInit {

  /** List of all entries for this timesheet.*/
  entries: Entry[] = [];
  /** List of all projects this user is allowed to access.*/
  projects: Project[] = [];

  /**
   * Holds the total number of hours worked this week.
   */
  tally: number = 0;

  /** A view container ref for the template that will be used to house the entry component.*/
  @ViewChild('componentHolder', {read: ViewContainerRef})
  entry_container: ViewContainerRef;

  constructor(private timesheetService: TimesheetService, private projectService: ProjectService, private entryService: EntryService) {
  }

  //TODO remove hard coding!
  /**
   * On initialization, calls getEntries to populate the entries variable as well as the projects variable.
   */
  ngOnInit() {
    this.getEntries(1);
    //TODO remove hard coded number
    this.getProjects(1);
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
    newEntry.timesheet = this.timesheetService.getCurrentTimesheet();

    this.entryService.save(newEntry).then( (data => {
      // this.entries.push(data)
      console.log(data);
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

    // this.entryService.deleteEntry(entry).subscribe();
  }

  save(){

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
