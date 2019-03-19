import {Component, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {UnitTypeService} from "../../../service/unit-type.service";
import {UnitType} from "../../../model/unitType";
import {EditUnitTypeComponent} from "../../modal/edit-unit-type/edit-unit-type.component";
import {MatDialog} from "@angular/material";

@Component({
  selector: 'app-unit-types-panel',
  templateUrl: './unit-types-panel.component.html',
  styleUrls: ['./unit-types-panel.component.css']
})
export class UnitTypesPanelComponent implements OnInit {

  columnsToDisplay = ['name', 'unit', 'weight'];

  @ViewChild('edit_unit_type_container', {read: ViewContainerRef})
  edit_unit_type: ViewContainerRef;

  constructor(public dialog: MatDialog, public unitTypeService: UnitTypeService) {
  }

  ngOnInit() {
    this.unitTypeService.initializeUnitTypes();
  }

  openEditDialog(unitType: UnitType) {
    this.dialog.open(EditUnitTypeComponent, {
      data: unitType
    });
  }
}

