import {Project} from "./project";

export class BillableHoursReportLine{
  billableHours:number;
  nonbillableHours:number;
  project:Project;

  constructor(){
    this.billableHours = 0;
    this.nonbillableHours= 0;
    this.project = null;
  }

  public static compareName(first: BillableHoursReportLine, second:BillableHoursReportLine){
    if (first.project.projectName < second.project.projectName) {
      return -1;
    }
    else if (first.project.projectName > second.project.projectName)
    {
      return 1;
    }
    return 0;
  }
}
