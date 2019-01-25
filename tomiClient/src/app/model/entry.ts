/**
 * An entry is one weeks' worth of work on a specific component.
 * Entries are part of timesheets and are used to determine billable and non billable hours,
 * as well as the productivity of users.
 *
 * @author Jessica Moffatt
 * @version 1.0
 */
export class Entry{
  //TODO explain what each number means, fix date and hours,
  // project isn't a string, task isn't a string, unitType isn't a string
  /** Represents the approval status of this entry.*/
  approved: number;
  /** The name of the project this entry is for.*/
  projectName: string;
  /** The list of days of the week.*/
  date: Date[];
  /** The corresponding hours worked for each day of the week.*/
  hours: number[];
  /** The project this entry is for.*/
  project: string;
  /** The task this entry is for.*/
  task: string;
  /** The component worked on for this entry.*/
  component: string;
  /** The number of units produced for this entry.*/
  quantity: number;
  /** The unit type corresponding to the component worked on for this entry.*/
  unitType: string;
  /** The unique identifier for this entry.*/
  id: number;

  //TODO assign approved to the correct number
  constructor(){
    this.approved = 1;
    this.projectName = "";
    this.date = [];
    this.hours = [0,0,0,0,0,0,0];
    this.project = "";
    this.task = "";
    this.component = "";
    this.quantity = 0;
    this.unitType = "";
    this.id = -1;
  }
}
