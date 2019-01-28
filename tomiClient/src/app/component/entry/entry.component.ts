import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Entry} from "../../model/entry";

/**
 * EntryComponent is used to facilitate communication between the view and front end services.
 *
 * @author Jessica Moffatt
 * @version 1.0
 */
@Component({
  selector: 'app-entry',
  templateUrl: './entry.component.html',
  styleUrls: ['./entry.component.scss']
})
export class EntryComponent implements OnInit {
  /** The entry model instance associated with this component. */
  @Input() entry: Entry;
  /** Event emitter used to notify the parent component that a copy of an entry has been requested. */
  @Output() copyRequested = new EventEmitter<any>();
  /** Event emitter used to notify the parent component that a delete of an entry has been requested. */
  @Output() deleteRequested = new EventEmitter<any>();

  /** List of all the characters to display representing the days of the week.*/
  days: string[] = ["M", "T", "W", "R", "F", "S", "U"];

  constructor() {
  }

  ngOnInit() {
  }

  /**
   * Emits a request for an entry to be copied.
   */
  copy(): void {
    this.copyRequested.emit(this.entry);
  }

  /**
   * Emits a request for an entry to be deleted.
   */
  delete(): void {
    this.deleteRequested.emit(this.entry);
  }
}
