/**
 * A task is
 *
 * @author James Andrade
 * @version 1.0
 */
export class Task{
  /** The unique identifier for this team.*/
  id: number;
  /** The name of this task.  100 char max*/
  name: string;
  /** If this task is billable*/
  billable: boolean;
  /** Represents whether or not the task is active.*/
  active: boolean;
  /** The list of links used for communicating with the back end.*/
  _links: [];

  constructor(){
    this.name = "";
    this.billable = false;
    this.active = true;
    this.id = -1;
    _links: new Array();
  }
}
