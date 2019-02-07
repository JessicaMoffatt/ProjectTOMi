import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Entry} from "../../../model/entry";
import {EntryService} from "../../../service/entry.service";
import {Project} from "../../../model/project";
import {Task} from 'src/app/model/task';
import {UnitType} from "../../../model/unitType";
import {TimesheetService} from "../../../service/timesheet.service";
import {ProjectService} from "../../../service/project.service";
import {TaskService} from "../../../service/task.service";
import {UnitTypeService} from "../../../service/unit-type.service";

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

  constructor(private entryService: EntryService, public timesheetService: TimesheetService,
              private projectService: ProjectService, private taskService: TaskService,
              private unitTypeService: UnitTypeService) {
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

  save() {
    this.entry.component = this.componentInput.nativeElement.value;
    this.entry.quantity = this.quantityInput.nativeElement.value;
    this.entry.mondayHours = this.mondayInput.nativeElement.value;
    this.entry.tuesdayHours = this.tuesdayInput.nativeElement.value;
    this.entry.wednesdayHours = this.wednesdayInput.nativeElement.value;
    this.entry.thursdayHours = this.thursdayInput.nativeElement.value;
    this.entry.fridayHours = this.fridayInput.nativeElement.value;
    this.entry.saturdayHours = this.saturdayInput.nativeElement.value;
    this.entry.sundayHours = this.sundayInput.nativeElement.value;

    //TODO not sure why I have to do this... inputs get reset, so I have to make sure to set them back.
    this.populateEntry().then(() => {
      this.entryService.save(this.entry).then();
    });
  }

  async populateEntry() {
    await this.projectService.getProjectById(this.projectInput.nativeElement.value).subscribe((data) => {
      this.entry.project = data;
    });

    await this.taskService.getTaskById(this.taskInput.nativeElement.value).subscribe((data)=>{

      this.entry.task = data;
    });

    await this.unitTypeService.getUnitTypeById(this.unitTypeInput.nativeElement.value).subscribe((data)=>{
      this.entry.unitType = data;
    });
  }
}
