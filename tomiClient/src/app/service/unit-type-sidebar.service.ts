import {ComponentRef, Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UnitTypeSidebarService {

  /** Used to reference the add Unit Type component created by click the Add User button. */
  ref: ComponentRef<any>;

  constructor() { }

  destroyAddUserAccountComponent() {
    this.ref.destroy();
  }
}
