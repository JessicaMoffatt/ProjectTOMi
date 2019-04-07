import {UserAccount} from "./userAccount";
import {Status} from "./status";


/**
 * Timesheet represents a single Timesheet for a user for a specific week.  Entries (taskSubject ,client, hours)
 * on the Timesheet are attached by referencing it.
 *
 * @author Jessica Moffatt
 * @version 1.0
 */
export class Timesheet{

  /** The unique ID of this Timesheet*/
  id: number;
  /** The UserAccount of the user that this Timesheet belongs to.*/
  userAccount: UserAccount;
  /** The submission status of the Timesheet, one of: logging, submitted, approved, rejected.*/
  status: Status;
  /** The day of the week that the Timesheet begins on.*/
  startDate: string;
  /** The list of links used for communicating with the back end.*/
  _links: [];

  constructor(){
    this.id = -1;
    this.userAccount = null;
    this.status = Status.LOGGING;
    this.startDate = null;
    this._links = [];
  }
}
