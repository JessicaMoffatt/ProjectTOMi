/**
 * A task is
 *
 * @author James Andrade
 * @version 1.0
 */
export class Expense{
  /** The unique identifier for this expense.*/
  id: number;
  /** The dollar value of the expense*/
  amount: number;
  /** A description of the expense. 255 char max*/
  notes: string;
  /** Represents whether or not the task is active.*/
  active: boolean;
  /** The unique identifier for the project that the expense is assigned to*/
  project_id: number;
  /** The list of links used for communicating with the back end.*/
  _links: [];

  constructor(){
    this.id = -1;
    this.amount = 0;
    this.notes = "";
    this.active = true;
    this.project_id = -1;
    _links: new Array();
  }
}
