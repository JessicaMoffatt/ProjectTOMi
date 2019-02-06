import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Entry} from "../../../model/entry";
import {EntryService} from "../../../service/entry.service";
import {Project} from "../../../model/project";
import {Task} from 'src/app/model/task';
import {UnitType} from "../../../model/unitType";
import {TimesheetService} from "../../../service/timesheet.service";

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
  /** The list of projects this user is allowed to access.*/
  @Input() projects: Project[];
  /** Event emitter used to notify the parent component that a copy of an entry has been requested. */
  @Output() copyRequested = new EventEmitter<any>();
  /** Event emitter used to notify the parent component that a delete of an entry has been requested. */
  @Output() deleteRequested = new EventEmitter<any>();

  /** List of all tasks.*/
  tasks: Task[];
  /** List of all unit types.*/
  unitTypes: UnitType[];

  constructor(private entryService: EntryService, public timesheetService:TimesheetService) {
  }

  ngOnInit() {
    this.getTasks();
    this.getUnitTypes();
  }

  getTasks(){
    this.entryService.getTasks().subscribe((data => this.tasks = data))
  }

  getUnitTypes(){
    this.entryService.getUnitTypes().subscribe((data => this.unitTypes = data))
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

  save(){
    console.log("SAVING...");
  }
}
