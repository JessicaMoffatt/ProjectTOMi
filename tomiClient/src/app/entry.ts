export class Entry{
  projectName: string;
  date: Date[];
  hours: number[];
  project: string;
  task: string;
  component: string;
  quantity: number;
  unitType: string;
  id: number;

  //TODO change id defaulting to -1
  constructor(){
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
