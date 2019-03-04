import {ComponentRef, Injectable} from '@angular/core';
import {UnitType} from "../model/unitType";

@Injectable({
  providedIn: 'root'
})
export class UnitTypePanelService {

  /** Used to reference the edit unit type component created by clicking the Edit Unit Type button.*/
  ref: ComponentRef<any>;

  selectedUnitType: UnitType = new UnitType();

  constructor() { }

  setSelectedUnitType(unitType: UnitType) {
    this.selectedUnitType = unitType;
  }

  destroyEditUnitTypeComponent() {
    this.ref.destroy();
  }
}
