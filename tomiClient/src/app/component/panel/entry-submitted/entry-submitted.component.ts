import {Component, Input, OnInit} from '@angular/core';
import {Entry} from "../../../model/entry";

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
