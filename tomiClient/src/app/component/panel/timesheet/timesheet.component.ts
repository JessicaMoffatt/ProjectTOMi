import {
  Component,
  OnInit, ViewChild, ViewContainerRef
} from '@angular/core';
import {Entry} from "../../../model/entry";
import {TEMPENTRIES} from "../entry/mock_entries";

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
  entries: Entry[];

  /**
   * Holds the total number of hours worked this week.
   */
  tally: number = 0;

  /** A view container ref for the template that will be used to house the entry component.*/
  @ViewChild('componentHolder', {read: ViewContainerRef})
  entry_container: ViewContainerRef;

  constructor() {
  }

  /**
   * On initialization, calls getEntries to populate the entries variable.
   */
  ngOnInit() {
    this.getEntries();
  }

  /**
   * Gets all entries for this timesheet.
   */
  getEntries(): void {
    // this.entryService.getEntries().subscribe(entries => this.entries = entries);
    this.entries = TEMPENTRIES;
    this.updateTally();
  }

  /**
   * Creates an empty entry for the timesheet.
   */
  public addEntry(): void {
    let newEntry = new Entry();

    //TODO change
    this.entries.push(newEntry);
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

  /**
   * Updates the tally for the total worked hours for the timesheet.
   */
  public updateTally(): void {
    //TODO if hours isn't an array need to change this, also change tempentries
    let hours = 0;
    this.entries.forEach(function (entry) {
      entry.hours.forEach(function (hr) {
        hours = hours + hr;
      })
    });

    this.tally = hours;
  }
}
