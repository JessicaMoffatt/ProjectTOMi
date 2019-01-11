import {Component, Input, OnInit} from '@angular/core';
import {Entry} from "../entry";
import {EntryService} from "../entry.service";
import {TEMPENTRIES} from "../entry/mock_entries";

@Component({
  selector: 'app-timesheet',
  templateUrl: './timesheet.component.html',
  styleUrls: ['./timesheet.component.css']
})
export class TimesheetComponent implements OnInit {

  // entries: Entry[];
  entries = TEMPENTRIES;

  constructor(
    private entryService: EntryService
  ) { }

  ngOnInit() {
    // this.getEntries();
  }

  getEntries():void{
    // this.entryService.getEntries().subscribe(entries => this.entries = entries);
  }

  addEntry(): void{

  }

}
