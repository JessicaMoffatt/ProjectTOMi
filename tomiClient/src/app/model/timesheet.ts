import {UserAccount} from "./userAccount";
import {Status} from "./status";

export class Timesheet{

  /** The unique ID of the timesheet*/
  id: number;
  /** The userAccount of the user that the timesheet belongs to.*/
  userAccount: UserAccount;
  /** The submission status of the timesheet, one of: logging, submitted, approved, rejected.*/
  status: Status;
  /** The day of the week that the timesheet begins on.*/
  startDate: Date;
  /** The date that the timesheet was submitted.*/
  submitDate: Date;
  /** If the timesheet is active.*/
  active: boolean;

  constructor(){
    this.id = -1;
    this.userAccount = null;
    this.status = Status.LOGGING;
    this.startDate = null;
    this.submitDate = new Date();
    this.active = true;
  }
}
