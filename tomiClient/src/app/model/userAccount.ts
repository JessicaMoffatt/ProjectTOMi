//TODO add projects properly
/**
 * A UserAccount represents a user of the application.
 *
 * @author Jessica Moffatt
 * @author Karol Talbot
 * @version 1.1
 */
export class UserAccount{
  /** The unique identifier for the user account.*/
  id:number;
  /** The first name of this user account.*/
  firstName:string;
  /** The last name of this user account.*/
  lastName:string;
  /** The email for this user account.*/
  email:string;
  /** The ID for the team this user account is a part of.*/
  teamId:number;
  /** The admin status for this user account.*/
  admin:boolean;
  /** The program director status for this user account.*/
  programDirector:boolean;
  /** The list of all projects associated with this user account.*/
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
