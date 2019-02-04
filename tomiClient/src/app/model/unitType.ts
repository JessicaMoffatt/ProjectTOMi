/**
 * A Unit Type is used to distinguish between types of units.
 *
 * @author Jessica Moffatt (updated by Iliya Kiritchkov)
 * @version 1.0
 */
export class UnitType{

  /** The unique identifier of this Unit Type. Used to distinguish between Unit Types.*/
  id: number;
  /** The name of this Unit Type.*/
  name: string;
  /** The unit of measurement for this Unit Type.*/
  unit: string;
  /** The measurement of value of for this Unit Type.*/
  weight: number;
  /** Represents whether or not this Unit Type is active.*/
  active: boolean;
  /** The list of links used for communicating with the back end.*/
  _links: [];

  constructor(){
    this.id = -1;
    this.name = "";
    this.unit = "";
    this.weight = 0;
    this.active = true;
    this._links = [];
  }
}
