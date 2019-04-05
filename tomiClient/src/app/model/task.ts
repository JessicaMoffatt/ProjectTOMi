/**
 * A Task is used to distinguish between types of tasks.
 *
 * @author James Andrade
 * @version 1.0
 */
export class Task{
  /** The unique identifier for this Task.*/
  id: number;
  /** The name of this Task.*/
  name: string;
  /** Represents if this Task is billable*/
  billable: boolean;
  /** The list of links used for communicating with the back end.*/
  _links: [];

  constructor(){
    this.name = "";
    this.billable = false;
    this.id = -1;
    this._links = [];
  }
}
