import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Entry} from "../../../model/entry";
import {EntryService} from "../../../service/entry.service";
import {Project} from "../../../model/project";
import {Task} from 'src/app/model/task';
import {UnitType} from "../../../model/unitType";
import {TimesheetService} from "../../../service/timesheet.service";
import {Status} from "../../../model/status";

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

  @ViewChild('componentInput') componentInput;
  @ViewChild('projectInput') projectInput;
  @ViewChild('taskInput') taskInput;
  @ViewChild('unitTypeInput') unitTypeInput;
  @ViewChild('quantityInput') quantityInput;
  @ViewChild('mondayInput') mondayInput;
  @ViewChild('tuesdayInput') tuesdayInput;
  @ViewChild('wednesdayInput') wednesdayInput;
  @ViewChild('thursdayInput') thursdayInput;
  @ViewChild('fridayInput') fridayInput;
  @ViewChild('saturdayInput') saturdayInput;
  @ViewChild('sundayInput') sundayInput;

  /** List of all tasks.*/
  tasks: Task[];
  /** List of all unit types.*/
  unitTypes: UnitType[];

  sts = Status;

  constructor(private entryService: EntryService, public timesheetService: TimesheetService) {
  }

  ngOnInit() {
    this.getTasks();
    this.getUnitTypes();
  }

  getTasks() {
    this.entryService.getTasks().subscribe((data => this.tasks = data))
  }

  getUnitTypes() {
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

  async save() {
    this.entry.component = this.componentInput.nativeElement.value;

    this.entry.quantity = this.quantityInput.nativeElement.value;
    if(this.entry.quantity.toString() === ""){
      this.entry.quantity = 0;
    }

    this.entry.mondayHours = this.mondayInput.nativeElement.value;
    if(this.entry.mondayHours.toString() === ""){
      this.entry.mondayHours = 0;
    }

    this.entry.tuesdayHours = this.tuesdayInput.nativeElement.value;
    if(this.entry.tuesdayHours.toString() === ""){
      this.entry.tuesdayHours = 0;
    }

    this.entry.wednesdayHours = this.wednesdayInput.nativeElement.value;
    if(this.entry.wednesdayHours.toString() === ""){
      this.entry.wednesdayHours = 0;
    }

    this.entry.thursdayHours = this.thursdayInput.nativeElement.value;
    if(this.entry.thursdayHours.toString() === ""){
      this.entry.thursdayHours = 0;
    }

    this.entry.fridayHours = this.fridayInput.nativeElement.value;
    if(this.entry.fridayHours.toString() === ""){
      this.entry.fridayHours = 0;
    }

    this.entry.saturdayHours = this.saturdayInput.nativeElement.value;
    if(this.entry.saturdayHours.toString() === ""){
      this.entry.saturdayHours = 0;
    }

    this.entry.sundayHours = this.sundayInput.nativeElement.value;
    if(this.entry.sundayHours.toString() === ""){
      this.entry.sundayHours = 0;
    }

    await this.populateEntryPromise().then(() => {
      this.entryService.save(this.entry).then();
    });
  }

  async populateEntryPromise() {
    let promise = new Promise((resolve, reject) => {
      resolve(
        this.populateEntry()
      )
    });

    return await promise;
  }

  private populateEntry(){
      if(this.projectInput.nativeElement.value != "-1"){

        let index = this.projects.findIndex((element) => {
          return (element.id == this.projectInput.nativeElement.value);
        });

        this.entry.project = this.projects[index];
      }else{
        this.entry.project = null;
      }

      if(this.taskInput.nativeElement.value != -1){
        let index = this.tasks.findIndex((element) => {
          return (element.id == this.taskInput.nativeElement.value);
        });

        this.entry.task = this.tasks[index];
      }else{
        this.entry.task = null;
      }

      if(this.unitTypeInput.nativeElement.value != -1){
        let index = this.unitTypes.findIndex((element) => {
          return (element.id == this.unitTypeInput.nativeElement.value);
        });

        this.entry.unitType = this.unitTypes[index];
      }else{
        this.entry.unitType = null;
      }

      return this.entry;
  }
}
