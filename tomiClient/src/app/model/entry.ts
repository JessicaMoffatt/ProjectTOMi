/**
 * An entry is one weeks' worth of work on a specific component.
 * Entries are part of timesheets and are used to determine billable and non billable hours,
 * as well as the productivity of users.
 *
 * @author Jessica Moffatt
 * @version 2.0
 */
import {Status} from "./status";
import {Project} from "./project";
import {Task} from "./task";
import {UnitType} from "./unitType";

export class Entry{
  /** The unique identifier for this entry.*/
  id: number;
  /** The project this entry is for.*/
  project: Project;
  /** The taskSubject this entry is for.*/
  task: Task;
  /** The unit type corresponding to the component worked on for this entry.*/
  unitType: UnitType;
  /** The timesheet associated with the entry.*/
  timesheet: number;
  /** Represents whether or not the entry has been approved by the project manager.*/
  status: Status;
  /** The component worked on for this entry.*/
  component: string;
  /** The hours worked on the Monday of the week for this Entry.*/
  mondayHours: number;
  /** The hours worked on the Tuesday of the week for this Entry.*/
  tuesdayHours: number;
  /** The hours worked on the Wednesday of the week for this Entry.*/
  wednesdayHours: number;
  /** The hours worked on the Thursday of the week for this Entry.*/
  thursdayHours: number;
  /** The hours worked on the Friday of the week for this Entry.*/
  fridayHours: number;
  /** The hours worked on the Saturday of the week for this Entry.*/
  saturdayHours: number;
  /** The hours worked on the Sunday of the week for this Entry.*/
  sundayHours: number;
  /** The total hours worked for the week for this Entry..*/
  totalHours: number;
  /** The quantity of the unit type's unit that was produced.*/
  quantity: number;
  /** The list of links used for communicating with the back end.*/
  _links: [];

  constructor(){
    this.id = -1;
    this.project = null;
    this.task = null;
    this.unitType = null;
    this.timesheet = null;
    this.status = Status.LOGGING;
    this.component = "";
    this.mondayHours = 0;
    this.tuesdayHours = 0;
    this.wednesdayHours = 0;
    this.thursdayHours = 0;
    this.fridayHours = 0;
    this.saturdayHours = 0;
    this.sundayHours = 0;
    this.totalHours = 0;
    this.quantity = 0;
    this._links = [];
  }
}
