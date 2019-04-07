/**
 * An Expense represents an expense for a Project. Expenses are any additional costs on a Project that need to be recorded.
 *
 * @author James Andrade
 * @version 1.0
 */
export class Expense{
  /** The unique identifier for this Expense.*/
  id: number;
  /** The dollar value of this Expense.*/
  amount: number;
  /** A description of this Expense.*/
  notes: string;
  /** The unique identifier for the project that the expense is assigned to*/
  project_id: number;
  /** The list of links used for communicating with the back end.*/
  _links: [];

  constructor(){
    this.id = -1;
    this.amount = 0;
    this.notes = "";
    this.project_id = -1;
    this._links = [];
  }
}
