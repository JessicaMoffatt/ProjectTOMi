import {Account} from "./account";

export class Team{
  id: number;
  teamName: string;
  teamLead: Account;
  active: boolean;

  //TODO remove id defaulting to -1
  constructor(){
    this.teamName = "";
    this.teamLead = new Account();
    this.active = false;
    this.id = -1;
  }
}
