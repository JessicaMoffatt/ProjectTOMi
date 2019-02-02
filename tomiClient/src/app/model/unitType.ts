
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

  constructor(){
    this.id = -1;
    this.name = "";
    this.unit = "";
    this.weight = 0;
    this.active = true;
  }
}
