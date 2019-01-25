import {
  Component,
  OnInit, ViewChild, ViewContainerRef
} from '@angular/core';
import {Entry} from "../../model/entry";
import {TEMPENTRIES} from "../entry/mock_entries";
import {EntryService} from "../../service/entry.service";

@Component({
  selector: 'app-timesheet',
  templateUrl: './timesheet.component.html',
  styleUrls: ['./timesheet.component.css']
})
export class TimesheetComponent implements OnInit {

  entries: Entry[];

  tally: number=0;

  @ViewChild('componentHolder', { read: ViewContainerRef }) componentHolder: ViewContainerRef;

  constructor(
    private entryService: EntryService
  ) { }

  ngOnInit() {
    this.getEntries();
  }

  getEntries():void{
    // this.entryService.getEntries().subscribe(entries => this.entries = entries);
    this.entries = TEMPENTRIES;
    this.updateTally();
  }

  public addEntry(): void{
    let newEntry = new Entry();

    //TODO change
    this.entries.push(newEntry);
  }

  copyEntry(entry: Entry):void{
    this.entries.push(entry);
  }

  deleteEntry(entry: Entry){
    let index = this.entries.indexOf(entry);
    this.entries.splice(index, 1);

    // this.entryService.deleteEntry(entry).subscribe();
  }

  public updateTally():void{
    //TODO if hours isn't an array need to change this, also change tempentries
    let hours = 0;
    this.entries.forEach(function(entry){
      entry.hours.forEach(function(hr){
        hours = hours + hr;
      })
    });

    this.tally = hours;
  }

}
