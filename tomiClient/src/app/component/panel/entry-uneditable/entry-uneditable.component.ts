import {Component, Input, OnInit} from '@angular/core';
import {Entry} from "../../../model/entry";
import {BreakpointObserver, Breakpoints} from "@angular/cdk/layout";

/**
 * EntryUneditableComponent is used to display Entries with a stats of SUBMITTED.
 *
 * @author Jessica Moffatt
 * @author Karol Talbot
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

  /**
   * Represents whether the screen size is small.
   */
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
