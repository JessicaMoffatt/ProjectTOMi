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
  //TODO explain what each number means, fix date and hours,
  // project isn't a string, task isn't a string, unitType isn't a string
  /** Represents the approval status of this entry.*/
  approved: number;
  /** The project this entry is for.*/
  project: Project;
  /** The task this entry is for.*/
  task: Task;
  /** The component worked on for this entry.*/
  component: string;
  /** The number of units produced for this entry.*/
  quantity: number;
  /** The unit type corresponding to the component worked on for this entry.*/
  unitType: UnitType;
  /** The unique identifier for this entry.*/
  id: number;
  /** The user account for which this entry is for.*/
  owner: UserAccount;
  /** Represents whether or not the entry has been approved by the project manager.*/
  status: Status;
  /** The Monday of the week this Entry is for.*/
  date: Date;

  constructor(){
    this.approved = 1;
    this.projectName = "";
    this.date = [];
    this.hours = [0,0,0,0,0,0,0];
    this.project = "";
    this.task = "";
    this.component = "";
    this.quantity = 0;
    this.unitType = "";
    this.id = -1;
    this.owner = null;
  }
}
