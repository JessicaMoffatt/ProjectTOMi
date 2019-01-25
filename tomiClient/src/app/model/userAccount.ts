//TODO add projects properly
/**
 * A UserAccount represents a user of the application.
 *
 * @author Jessica Moffatt
 * @version 1.0
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
  /** The salaried rate for this user account.*/
  salariedRate:number;
  /** Represents the active status of this user account.*/
  active:boolean;
  /** The ID for the team this user account is a part of.*/
  teamId:number;
  /** The list of all projects associated with this user account.*/
  projects:Object;
  /** The list of linked used to communicate with the backennd.*/
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
