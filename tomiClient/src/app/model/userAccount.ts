/**
 * A UserAccount represents a user of the application.
 *
 * @author Jessica Moffatt
 * @version 1.1
 */
export class UserAccount{
  /** The unique identifier for the UserAccount.*/
  id:number;
  /** The first name of this UserAccount.*/
  firstName:string;
  /** The last name of this UserAccount.*/
  lastName:string;
  /** The email for this UserAccount.*/
  email:string;
  /** The ID for the team this UserAccount is a part of.*/
  teamId:number;
  /** The admin status for this UserAccount.*/
  admin:boolean;
  /** The program director status for this UserAccount.*/
  programDirector:boolean;
  /** The list of all projects associated with this UserAccount.*/
  projects:[];
  /** The list of linked used to communicate with the backennd.*/
  _links: [];

  constructor(){
    this.id = -1;
    this.firstName = "";
    this.lastName = "";
    this.email = "";
    this.teamId = -1;
    this.admin = false;
    this.programDirector=false;
    this._links = [];
  }
}
