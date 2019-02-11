/**
 * A task is
 *
 * @author James Andrade
 * @version 1.0
 */
export class Task{

  id: number;
  name: string;
  billable: boolean;
  active: boolean;

  constructor(){
    this.id = -1;
    this.name = "";
    this.billable = false;
    this.active = true;
  }

}
