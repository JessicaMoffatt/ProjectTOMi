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

  private userId = 1;

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
    this.thingie.changes.subscribe(c => {
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
    this.timesheetService.getEntries(id).subscribe((data) => this.entries = data);
  }

  getProjects(id:number): void{
    this.projectService.getProjectsForUser(id).subscribe((data => this.projects = data));
  }

  /**
   * Creates an empty entry for the timesheet.
   */
  public addEntry(): void {
    let newEntry = new Entry();

    this.timesheetService.getCurrentTimesheet().then((data)=>{
      newEntry.timesheet = data.id;

      this.entryService.save(newEntry).then( (data => {
        this.entries.push(data);
        this.entryComponents = [];
      }));
    });
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
   */
  deleteEntry(entry: Entry) {
    let index = this.entries.indexOf(entry);
    this.entries.splice(index, 1);

    this.entryService.delete(entry);

    this.entryComponents = [];

    this.updateTally();
  }

  save(){
    this.entryComponents.forEach(item => {
      item.save().then(()=>{
        this.updateTally();
      });
    });
  }

  submit(){
    this.timesheetService.submit().then();
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
}
