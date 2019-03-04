import {Component, ComponentFactoryResolver, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {UnitTypeService} from "../../../service/unit-type.service";
import {UnitType} from "../../../model/unitType";
import {UnitTypePanelService} from "../../../service/unit-type-panel.service";
import {EditUnitTypeComponent} from "../../modal/edit-unit-type/edit-unit-type.component";

@Component({
  selector: 'app-unit-types-panel',
  templateUrl: './unit-types-panel.component.html',
  styleUrls: ['./unit-types-panel.component.css']
})
export class UnitTypesPanelComponent implements OnInit {

  @ViewChild('edit_unit_type_container', {read: ViewContainerRef})
  edit_unit_type: ViewContainerRef;

  constructor(public unitTypeService: UnitTypeService, public unitTypePanelService: UnitTypePanelService, public resolver: ComponentFactoryResolver) { }

  ngOnInit() {
    this.unitTypeService.initializeUnitTypes();
  }

  editUnitType(unitType: UnitType) {
    this.unitTypePanelService.setSelectedUnitType(unitType);
    this.edit_unit_type.clear();
    const factory = this.resolver.resolveComponentFactory(EditUnitTypeComponent);
    this.unitTypePanelService.ref = this.edit_unit_type.createComponent(factory);
  }

  deleteUnitType(unitType: UnitType) {
    this.unitTypeService.DELETEUnitType(unitType);
  }
}
