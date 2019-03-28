import {Project} from "./project";

export class BudgetReport{
  date:string;
  budget:number;
  billableHours:number;
  nonBillableHours:number;
  project:Project;
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
