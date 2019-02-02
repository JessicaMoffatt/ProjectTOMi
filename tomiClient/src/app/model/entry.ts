/**
 * An entry is one weeks' worth of work on a specific component.
 * Entries are part of timesheets and are used to determine billable and non billable hours,
 * as well as the productivity of users.
 *
 * @author Jessica Moffatt
 * @version 1.0
 */
import {UserAccount} from "./userAccount";
import {Project} from "./project";
import {Task} from './task';
import {UnitType} from "./unitType";
import {Status} from "./status";

export class Entry{
  /** The project this entry is for.*/
  project: Project;
  /** The task this entry is for.*/
  task: Task;
  /** The component worked on for this entry.*/
  component: string;
  /** The quantity of the unit type's unit that was produced.*/
  quantity: number;
  /** The unit type corresponding to the component worked on for this entry.*/
  unitType: UnitType;
  /** The unique identifier for this entry.*/
  id: number;
  /** The user account for which this entry is for.*/
  userAccount: UserAccount;
  /** Represents whether or not the entry has been approved by the project manager.*/
  status: Status;
  /** The Monday of the week this Entry is for.*/
  date: Date;
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

  constructor(){
    this.status = Status.LOGGING;
    
  }
}
