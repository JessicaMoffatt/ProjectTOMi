import {Client} from "./client";
import {UserAccount} from "./userAccount";

export class Project{

  /** The unique identifier for this Project.*/
  id: number;
  /** The Client this Project is for.*/
  client: Client;
  /** The UserAccount managing this Project.*/
  projectManager: UserAccount;
  /** The name of this Project.*/
  projectName: string;
  /** The budget assigned to this Project multiplied by 100 to remove decimals.*/
  budget: number;
  /**
   * The rate at which this Project members' billable hours will be billed to the client at
   * multiplied by 100 to remove decimals.
   */
  billableRate: number;
  /** The Accounts that are members of this Project.*/
  projectMembers: UserAccount[];
  /** If this Project is active.*/
  active: boolean;

  constructor(){
    this.id = -1;
    this.client = new Client();
    this.projectManager = new UserAccount();
    this.projectName = "";
    this.budget = 0;
    this.billableRate = 0;
    this.projectMembers = [];
    this.active = true;
  }
}
