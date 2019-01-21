import {Team} from "./team";

//TODO add projects properly
export class Account{
  id:number;
  firstName:string;
  lastName:string;
  email:string;
  salariedRate:number;
  active:boolean;
  teamId:number;
  projects:Object;
  _links: Object;

  constructor(){
    this.id = -1;
    this.firstName = "";
    this.lastName = "";
    this.email = "";
    this.salariedRate = 0;
    this.active = true;
    this.teamId = -1;
  }
}
