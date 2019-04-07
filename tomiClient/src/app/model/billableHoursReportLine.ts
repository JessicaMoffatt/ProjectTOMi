import {Project} from "./project";

/**
 * A BillableHoursReportLine represents one line of a billable hour report.
 *
 * @author Jessica Moffatt
 * @version 1.0
 */
export class BillableHoursReportLine{
  /** The billable hours for the Project.*/
  billableHours:number;
  /** The non billable hours for the Project.*/
  nonbillableHours:number;
  /** The Project this billable hour report is for.*/
  project:Project;

  constructor(){
    this.billableHours = 0;
    this.nonbillableHours= 0;
    this.project = null;
  }

  /**
   * Method used to compare two BillableHoursReportLines by the Project's name.
   * @param first The first BillableHoursReportLine to compare.
   * @param second The second BillableHoursReportLine to compare.
   */
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
