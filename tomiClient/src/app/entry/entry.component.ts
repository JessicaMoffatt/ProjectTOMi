import {Component, Input, OnInit} from '@angular/core';
import {Entry} from "../entry";
import {EntryService} from "../entry.service";

@Component({
  selector: 'app-entry',
  templateUrl: './entry.component.html',
  styleUrls: ['./entry.component.css']
})

export class EntryComponent implements OnInit {
  @Input() entry: Entry;

  days: string[] = ["M","T","W","R","F","S","U"];

  constructor(
    private entryService: EntryService
  ) { }

  ngOnInit() {
  }

  copy():void{
    this.entryService.copyEntry(this.entry);
  }

  delete():void{
    this.entryService.deleteEntry(this.entry);
  }
}
