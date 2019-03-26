import {UserAccount} from "./userAccount";
import {Status} from "./status";


/**
 * Timesheet represents a single timesheet for a user for a specific week.  Entries (taskSubject ,client, hours)
 * on the timesheet are attached by referencing it.
 *
 * @author Jessica Moffatt
 * @version 1.0
 */
export class Timesheet{

  /** The unique ID of the timesheet*/
  id: number;
  /** The userAccount of the user that the timesheet belongs to.*/
  userAccount: UserAccount;
  /** The submission status of the timesheet, one of: logging, submitted, approved, rejected.*/
  status: Status;
  /** The day of the week that the timesheet begins on.*/
  startDate: string;
  /** The date that the timesheet was submitted.*/
  submitDate: string;
  /** The list of links used for communicating with the back end.*/
  _links: [];

  constructor(){
    this.id = -1;
    this.userAccount = null;
    this.status = Status.LOGGING;
    this.startDate = null;
    this.submitDate = null;
    this._links = [];
  }
}
