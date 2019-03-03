import { Component, OnInit } from '@angular/core';
import {UnitTypeService} from "../../../service/unit-type.service";
import {UnitType} from "../../../model/unitType";
import {UnitTypePanelService} from "../../../service/unit-type-panel.service";

@Component({
  selector: 'app-unit-types-panel',
  templateUrl: './unit-types-panel.component.html',
  styleUrls: ['./unit-types-panel.component.css']
})
export class UnitTypesPanelComponent implements OnInit {

  constructor(public unitTypeService: UnitTypeService, public unitTypePanelService: UnitTypePanelService) { }

  ngOnInit() {
  }

  editUnitType(unitType: UnitType) {

  }

  deleteUnitType(unitType: UnitType) {
    this.unitTypeService.DELETEUnitType(unitType);
  }
}
