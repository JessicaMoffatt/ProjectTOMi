import {
  Component,
  ComponentFactoryResolver,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import {Entry} from "../entry";
import {EntryService} from "../entry.service";
import {TEMPENTRIES} from "../entry/mock_entries";
import {EntryComponent} from "../entry/entry.component";

@Component({
  selector: 'app-timesheet',
  templateUrl: './timesheet.component.html',
  styleUrls: ['./timesheet.component.css']
})
export class TimesheetComponent implements OnInit {

  // entries: Entry[];
  entries = TEMPENTRIES;

  @ViewChild('componentHolder', { read: ViewContainerRef }) componentHolder: ViewContainerRef;

  constructor(
    private entryService: EntryService,
    private componentFactoryResolver: ComponentFactoryResolver
  ) { }

  ngOnInit() {
    // this.getEntries();
  }

  getEntries():void{
    // this.entryService.getEntries().subscribe(entries => this.entries = entries);
  }

  public addEntry(): void{
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(EntryComponent);
    const componentRef = this.componentHolder.createComponent(componentFactory);
    componentRef.instance.setEntry(new Entry());
  }

  copyEntry(event: any):void{
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(EntryComponent);
    const componentRef = this.componentHolder.createComponent(componentFactory);
    componentRef.instance.setEntry(event as Entry);
  }

}
