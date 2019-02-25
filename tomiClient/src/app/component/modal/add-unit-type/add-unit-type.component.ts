import {Component, OnInit, ViewChild} from '@angular/core';
import {UnitTypeSidebarService} from "../../../service/unit-type-sidebar.service";
import {UnitType} from "../../../model/unitType";
import {UnitTypeService} from "../../../service/unit-type.service";

@Component({
  selector: 'app-add-unit-type',
  templateUrl: './add-unit-type.component.html',
  styleUrls: ['./add-unit-type.component.scss']
})
export class AddUnitTypeComponent implements OnInit {

  /** The input field for the Unit Types's name.*/
  @ViewChild('name') unitTypeName;

  /** The input field for the Unit Types's unit.*/
  @ViewChild('unit') unitTypeUnit;

  /** The input field for the Unit Types's weight.*/
  @ViewChild('weight') unitTypeWeight;

  constructor(private unitTypeSidebarService: UnitTypeSidebarService, private unitTypeService: UnitTypeService) { }

  ngOnInit() {
  }

  /**
   * Adds a new Unit Type. Passes the request to save the new Unit Type to the UnitTypeService.
   */
  addUnitType() {
    let unitType = new UnitType();
    unitType.name = this.unitTypeName.nativeElement.value;
    unitType.unit = this.unitTypeUnit.nativeElement.value;
    unitType.weight = Number (this.unitTypeWeight.nativeElement.value);

    let goodUnitType = true;

    if (!(unitType.name.length > 0)) {
      goodUnitType = false;
    }

    //Ensure that the name is unique
    if (!(this.unitTypeService.unitTypes.getValue().every(existingUnitType => {
      return existingUnitType.name !== unitType.name;
    }))) {
      goodUnitType = false;
    }

    if (!(unitType.unit.length > 0)) {
      goodUnitType = false;
    }

    if (!(unitType.weight >= 0)) {
      goodUnitType = false;
    }

    if (goodUnitType) {
      this.unitTypeService.saveUnitType(unitType).then( value => {
        this.destroyAddUnitTypeComponent();
      });
    }
  }

  /**
   * Destroy the AddUnitType modal.
   */
  destroyAddUnitTypeComponent() {
    this.unitTypeSidebarService.destroyAddUnitTypeComponent();
  }
}
