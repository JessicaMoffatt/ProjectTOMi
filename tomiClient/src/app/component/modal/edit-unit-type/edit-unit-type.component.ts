import {Component, Input, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {UnitTypePanelService} from "../../../service/unit-type-panel.service";
import {UnitTypeService} from "../../../service/unit-type.service";

@Component({
  selector: 'app-edit-unit-type',
  templateUrl: './edit-unit-type.component.html',
  styleUrls: ['./edit-unit-type.component.scss']
})
export class EditUnitTypeComponent implements OnInit {

  /** A view container ref for the template that will be used to house the edit unit type component. */
  @Input() @ViewChild('edit_unit_type_container', {read: ViewContainerRef})
  edit_unit_type_container: ViewContainerRef;

  /** The input field for the UnitType's name. */
  @ViewChild('editUnitTypeName') editUnitTypeName;

  /** The input field for the UnitType's unit. */
  @ViewChild('editUnitTypeUnit') editUnitTypeUnit;

  /** The input field for the UnitType's weight. */
  @ViewChild('editUnitTypeWeight') editUnitTypeWeight;

  constructor( private unitTypeService: UnitTypeService, public unitTypePanelService: UnitTypePanelService) { }

  ngOnInit() {

  }

  /**
   * Dynamically creates the edit unit type component, which will be housed in the template with the id of 'edit_unit_type_container'.
   */
  saveUnitType(): void {
    let editedUnitType = this.unitTypePanelService.selectedUnitType;
    editedUnitType.name = this.editUnitTypeName.nativeElement.value;
    editedUnitType.unit = this.editUnitTypeUnit.nativeElement.value;
    editedUnitType.weight = Number (this.editUnitTypeWeight.nativeElement.value);


    let goodUnitType = true;

    if (!(editedUnitType.name.length > 0)) {
      goodUnitType = false;
    }

    //Ensure that the name is unique
    if (!(this.unitTypeService.unitTypes.getValue().every(existingUnitType => {
      if (existingUnitType.id === editedUnitType.id) {
        return true;
      } else {
        return existingUnitType.name !== editedUnitType.name;
      }
    }))) {
      goodUnitType = false;
    }

    if (!(editedUnitType.unit.length > 0)) {
      goodUnitType = false;
    }

    if (!(editedUnitType.weight >= 0)) {
      goodUnitType = false;
    }
    console.log(editedUnitType);

    if (goodUnitType) {
      this.unitTypeService.saveUnitType(editedUnitType).then( value => {
        this.destroyEditUnitTypeComponent();
      });
    }
  }

  /**
   * Destroys the dynamically created edit unit type component.
   */
  destroyEditUnitTypeComponent(): void {
    this.unitTypePanelService.selectedUnitType = null;
    this.unitTypePanelService.destroyEditUnitTypeComponent();
  }

}
