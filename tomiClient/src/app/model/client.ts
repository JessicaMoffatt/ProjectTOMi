/**
 * A model class for storing information related to the Client.
 *
 * @author Jessica Moffatt
 * @version 1.0
 */
export class Client{

  /** The unique identifier for this Client.*/
  id: number;
  /** The name of this Client.*/
  name: string;
  /** If this Client is active.*/
  active: boolean;
  /** The list of links used for communicating with the back end.*/
  _links: [];

  constructor(){
    this.id = -1;
    this.name = "";
    this.active = true;
    this._links = [];
  }
}
