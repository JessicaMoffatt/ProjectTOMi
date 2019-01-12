import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Entry} from "../entry";
import {EntryService} from "../entry.service";

@Component({
  selector: 'app-entry',
  templateUrl: './entry.component.html',
  styleUrls: ['./entry.component.css']
})

export class EntryComponent implements OnInit {
  @Input() entry: Entry;

  @Output() copyRequested = new EventEmitter<any>();

  days: string[] = ["M","T","W","R","F","S","U"];

  constructor(
    private entryService: EntryService
  ) { }

  ngOnInit() {
  }

  copy():void{
    this.copyRequested.emit(this.entry);
  }

  delete():void{
    this.entryService.deleteEntry(this.entry);
  }

  setEntry(passedEntry: Entry){
    this.entry = passedEntry;
  }
}
