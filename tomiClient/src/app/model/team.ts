/**
 * A team represents a group of users whom work under the same team lead.
 * The use of the team is to distinguish which users’ time sheets a team leader is allowed to view,
 * as well as which users’ productivity reports they will be allowed to view.
 *
 * @author Jessica Moffatt
 * @version 1.0
 */
export class Team{
  /** The unique identifier for this team.*/
  id: number;
  /** The name of this team.*/
  teamName: string;
  /** The ID for the team lead of this team.*/
  leadId: number;
  /** Represents whether or not the team is active.*/
  active: boolean;
  /** The list of links used for communicating with the back end.*/
  _links: [];

  constructor(){
    this.teamName = "";
    this.leadId = -1;
    this.active = true;
    this.id = -1;
    _links: [];
  }
}
