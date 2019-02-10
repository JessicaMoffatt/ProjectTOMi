import {Component, Input, OnInit} from '@angular/core';
import {Entry} from "../../../model/entry";

/**
 * The component used to display entries with a stats of submitted.
 *
 * @author Jessica Moffatt
 * @version 1.0
 */
@Component({
  selector: 'app-entry-submitted',
  templateUrl: './entry-submitted.component.html',
  styleUrls: ['../entry/entry.component.scss']
})
export class EntrySubmittedComponent implements OnInit {
  /** The entry model instance associated with this component. */
  @Input() entry: Entry;

  constructor() { }

  ngOnInit() {
  }

}
