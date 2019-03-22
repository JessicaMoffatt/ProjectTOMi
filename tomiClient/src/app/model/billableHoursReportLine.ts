import {Project} from "./project";

export class BillableHoursReportLine{
  billableHours:number;
  nonBillableHours:number;
  project:Project;

  constructor(){
    this.billableHours = 0;
    this.nonBillableHours= 0;
    this.project = null;
  }
}
