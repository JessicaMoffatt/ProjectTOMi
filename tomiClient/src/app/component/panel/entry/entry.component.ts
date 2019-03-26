import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Entry} from "../../../model/entry";
import {EntryService} from "../../../service/entry.service";
import {Project} from "../../../model/project";
import {Task} from 'src/app/model/task';
import {UnitType} from "../../../model/unitType";
import {TimesheetService} from "../../../service/timesheet.service";
import {BreakpointObserver, Breakpoints} from "@angular/cdk/layout";

/**
 * EntryComponent is used to facilitate communication between the view and front end services.
 *
 * @author Jessica Moffatt
 * @author Karol Talbot
 * @version 2.0
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
  /** The list of unit types this user is allowed to access.*/
  @Input() unitTypes: UnitType[];
  /** The list of tasks this user is allowed to access.*/
  @Input() tasks: Task[];
  /** Event emitter used to notify the parent component that a copy of an entry has been requested. */
  @Output() requestCopy = new EventEmitter<any>();
  /** Event emitter used to notify the parent component that a delete of an entry has been requested. */
  @Output() showDeleteModal = new EventEmitter<any>();

  /** The input field for the entry's component.*/
  @ViewChild('componentInput') componentInput;
  /** The input field for the entry's project.*/
  @ViewChild('projectInput') projectInput;
  /** The input field for the entry's taskSubject.*/
  @ViewChild('taskInput') taskInput;
  /** The input field for the entry's unit type.*/
  @ViewChild('unitTypeInput') unitTypeInput;
  /** The input field for the entry's quantity.*/
  @ViewChild('quantityInput') quantityInput;
  /** The input field for the entry's monday hours.*/
  @ViewChild('mondayInput') mondayInput;
  /** The input field for the entry's tuesday hours.*/
  @ViewChild('tuesdayInput') tuesdayInput;
  /** The input field for the entry's wednesday hours.*/
  @ViewChild('wednesdayInput') wednesdayInput;
  /** The input field for the entry's thursday hours.*/
  @ViewChild('thursdayInput') thursdayInput;
  /** The input field for the entry's friday hours.*/
  @ViewChild('fridayInput') fridayInput;
  /** The input field for the entry's saturday hours.*/
  @ViewChild('saturdayInput') saturdayInput;
  /** The input field for the entry's sunday hours.*/
  @ViewChild('sundayInput') sundayInput;

  smallScreen: boolean = false;

  constructor(private entryService: EntryService, public timesheetService: TimesheetService, private  breakpointObserver: BreakpointObserver) {
    breakpointObserver.observe([
      Breakpoints.XSmall,
      Breakpoints.Small
    ]).subscribe(result => {
      if (result.matches) {
        this.smallScreen=true;
      }else{
        this.smallScreen=false;
      }
    });
  }

  /** On initialization, populates the list of tasks and unit types.*/
  ngOnInit() {

  }

  /**
   * Emits a request for an entry to be copied.
   */
  copy(): void {
    this.requestCopy.emit(this.entry);
  }

  /**
   * Emits a request for an entry to be deleted.
   */
  delete(): void {
    this.showDeleteModal.emit(this.entry);
  }

  /** Validates that the entry has no null or empty values.*/
  validateEntry(): boolean{
    let valid:boolean = false;

    if(this.entry.component != null && this.entry.component != ""
      && this.entry.quantity != null && this.entry.quantity != 0
      && this.mondayInput.nativeElement.value != null && this.tuesdayInput.nativeElement.value != null
      && this.wednesdayInput.nativeElement.value != null && this.thursdayInput.nativeElement.value != null
      && this.fridayInput.nativeElement.value != null && this.saturdayInput.nativeElement.value != null
      && this.sundayInput.nativeElement.value != null
      && this.projectInput.selected.value != null && this.projectInput.selected.value != "-1"
      && this.taskInput.selected.value != null && this.taskInput.selected.value != -1
      && this.unitTypeInput.selected.value != null && this.unitTypeInput.selected.value != -1){
      valid = true;
    }

    return valid;
  }

  /**
   * Saves the values of the entry.
   */
  async save() {
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

    return await this.populateEntryPromise().then(() => {
      return this.entryService.save(this.entry).then();
    });
  }

  /**
   * This method uses a promise to force populateEntry to complete before continuing.
   */
  async populateEntryPromise() {
    let promise = new Promise((resolve, reject) => {
      resolve(
        this.populateEntry()
      )
    });

    return await promise;
  }

  /**
   * Populates this entry with project, taskSubject and unit type information.
   */
  private populateEntry(){
      if(this.projectInput.selected &&  this.projectInput.selected.value != "-1"){

        let index = this.projects.findIndex((element) => {
          return (element.id == this.projectInput.selected.value);
        });

        this.entry.project = this.projects[index];
      }else{
        this.entry.project = null;
      }

      if(this.taskInput.selected && this.taskInput.selected.value != -1){
        let index = this.tasks.findIndex((element) => {
          return (element.id == this.taskInput.selected.value);
        });

        this.entry.task = this.tasks[index];
      }else{
        this.entry.task = null;
      }

      if(this.unitTypeInput.selected && this.unitTypeInput.selected.value != -1){
        let index = this.unitTypes.findIndex((element) => {
          return (element.id == this.unitTypeInput.selected.value);
        });

        this.entry.unitType = this.unitTypes[index];
      }else{
        this.entry.unitType = null;
      }

      return this.entry;
  }

  validateNumber(event){
    if(event.key === '-' || event.key === '+'){
      return false;
    }
  }
}
