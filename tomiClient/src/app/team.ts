import {Account} from "./account";

export class Team{
  id: number;
  teamName: string;
  teamLead: number;
  active: boolean;
  _links: Object;

  constructor(){
    this.teamName = "";
    this.teamLead = -1;
    this.active = true;
    this.id = -1;
  }
}
