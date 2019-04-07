import {Project} from "./project";

/**
 * A BudgetReport represents the budget report for a Project. Budget Reports
 * include information about planned hours, actual hours, billable hours and non billable hours.
 *
 * @author Jessica Moffatt
 * @version 1.0
 */
export class BudgetReport{
  /** The date of the report.*/
  date:string;
  /** The budget dollar amount for the Project.*/
  budget:number;
  /** The total billable hours worked on this Project.*/
  billableHours:number;
  /** The total non billable hours worked on this Project.*/
  nonBillableHours:number;
  /** The Project this BudgetReport is for.*/
  project:Project;
  /** The total planned hours for this Project.*/
  totalHours:number;

  constructor(){
    this.date = "";
    this.budget = 0;
    this.billableHours = 0;
    this.nonBillableHours= 0;
    this.project = null;
    this.totalHours = 0;
  }
}
