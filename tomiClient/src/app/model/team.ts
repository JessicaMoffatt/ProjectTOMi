export class Team{
  id: number;
  teamName: string;
  leadId: number;
  active: boolean;
  _links: [];

  constructor(){
    this.teamName = "";
    this.leadId = -1;
    this.active = true;
    this.id = -1;
    _links: new Array();
  }
}
