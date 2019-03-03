import {ComponentRef, Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UnitTypePanelService {

  /** Used to reference the edit unit type component created by clicking the Edit Unit Type button.*/
  ref: ComponentRef<any>;

  constructor() { }

  destroyEditUnitTypeComponent() {
    this.ref.destroy();
  }
}
