import {Component, Input, OnInit} from '@angular/core';
import {Entry} from "../../../model/entry";
import {TimesheetComponent} from "../timesheet/timesheet.component";
import {BreakpointObserver, Breakpoints} from "@angular/cdk/layout";

/**
 * The component used to display entries with a stats of submitted.
 *
 * @author Jessica Moffatt
 * @version 1.0
 */
@Component({
  selector: 'app-entry-uneditable',
  templateUrl: './entry-uneditable.component.html',
  styleUrls: ['../entry-uneditable/entry-uneditable.component.scss']
})
export class EntryUneditableComponent implements OnInit {
  /** The entry model instance associated with this component. */
  @Input() entry: Entry;
  smallScreen:Boolean = false;

  constructor(private breakpointObserver:BreakpointObserver) {
    breakpointObserver.observe([
      Breakpoints.XSmall,
      Breakpoints.Small
    ]).subscribe(result => {
      this.smallScreen = result.matches;
    });
  }

  ngOnInit() {
  }

}
