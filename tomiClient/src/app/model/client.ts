
export class Client{

  /** The unique identifier for this Client.*/
  id: number;
  /** The name of this Client.*/
  name: string;
  /** If this Client is active.*/
  active: boolean;

  constructor(){
    this.id = -1;
    this.name = "";
    this.active = true;
  }
}
