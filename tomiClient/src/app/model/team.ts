/**
 * A team represents a group of users whom work under the same team lead.
 * The use of the team is to distinguish which users’ time sheets a team leader is allowed to view,
 * as well as which users’ productivity reports they will be allowed to view.
 *
 * @author Jessica Moffatt
 * @version 1.0
 */
export class Team{
  /** The unique identifier for this Team.*/
  id: number;
  /** The name of this Team.*/
  teamName: string;
  /** The ID for the team lead of this Team.*/
  leadId: number;
  /** The list of links used for communicating with the back end.*/
  _links: [];

  constructor(){
    this.teamName = "";
    this.leadId = -1;
    this.id = -1;
    this._links =  [];
  }
}
