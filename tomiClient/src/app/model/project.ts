import {Client} from "./client";
import {UserAccount} from "./userAccount";

/**
 * A Project represents a project that either needs to be completed, or has been completed
 * (dependent on it's active status.) Projects are worked on by specific {@link UserAccount} lead by
 * a project manager.
 *
 * @author Jessica Moffatt
 * @version 1.0
 */
export class Project{

  /** The unique identifier for this Project.*/
  id: string;
  /** The Client this Project is for.*/
  client: Client;
  /** The ID of the UserAccount managing this Project.*/
  projectManagerId: number;
  /** The name of this Project.*/
  projectName: string;
  /** The budget assigned to this Project multiplied by 100 to remove decimals.*/
  budget: number;
  /**
   * The rate at which this Project members' billable hours will be billed to the client at
   * multiplied by 100 to remove decimals.
   */
  billableRate: number;
  _links: [];

  constructor(){
    this.id = "";
    this.client = new Client();
    this.projectManagerId = -1;
    this.projectName = "";
    this.budget = 0;
    this.billableRate = 0;
    this._links = [];
  }
}
