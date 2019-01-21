import {Account} from "./account";

export class Team{
  id: number;
  teamName: string;
  teamLead: Account;
  active: boolean;
  _links: Object;

  constructor(){
    this.teamName = "";
    this.teamLead = new Account();
    this.active = true;
    this.id = -1;
  }
}
