import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {UnitTypePanelService} from "../../../service/unit-type-panel.service";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import {UnitType} from "../../../model/unitType";
import {FormControl, Validators} from "@angular/forms";
import {MyErrorStateMatcher} from "../add-unit-type/add-unit-type.component";
import {UnitTypeService} from "../../../service/unit-type.service";

@Component({
  selector: 'app-edit-unit-type',
  templateUrl: './edit-unit-type.component.html',
  styleUrls: ['./edit-unit-type.component.scss']
})
export class EditUnitTypeComponent implements OnInit {

  /** Validations for the name. */
  unitTypeNameControl = new FormControl('', [
    Validators.required,
    Validators.pattern('')
  ]);

  /** Validations for the unit. */
  unitTypeUnitControl = new FormControl('', [
    Validators.required,
  ]);

  /** Validations for the weight. */
  unitTypeWeightControl = new FormControl('', [
    Validators.required,
    Validators.min(0)
  ]);

  /** Invalid name error detection. */
  unitTypeNameMatcher = new MyErrorStateMatcher();

  /** Invalid unit error detection. */
  unitTypeUnitMatcher = new MyErrorStateMatcher();

  /** Invalid weight error detection. */
  unitTypeWeightMatcher = new MyErrorStateMatcher();

  /** The input field for the Unit Types's name.*/
  @ViewChild('editUnitTypeName') editUnitTypeName;

  /** The input field for the Unit Types's unit.*/
  @ViewChild('editUnitTypeUnit') editUnitTypeUnit;

  /** The input field for the Unit Types's weight.*/
  @ViewChild('editUnitTypeWeight') editUnitTypeWeight;

  /** The ngForm for this component. */
  @ViewChild('editUnitTypeForm') editUnitTypeForm;

  constructor(public dialogRef: MatDialogRef<EditUnitTypeComponent>, @Inject(MAT_DIALOG_DATA) public unitType: UnitType, public unitTypeService: UnitTypeService) { }

  ngOnInit() {
    this.applyUniqueNameValidator();
  }

  /**
   * Dynamically generate a unique name regex pattern to ensure that new Unit Types have unique names.
   */
  applyUniqueNameValidator() {
    const existingName = this.unitType.name;
    let existingUnitTypeNamesRegex = "^(?!.*(";
    //Add every existing unit type name to the regex
    this.unitTypeService.unitTypes.getValue().forEach(existingUnitType => {
      if (1===1)
      existingUnitTypeNamesRegex += "^" + existingUnitType.name + "$|";
    });
    //Remove the last | that was added in the forEach loop.
    existingUnitTypeNamesRegex = existingUnitTypeNamesRegex.substring(0, existingUnitTypeNamesRegex.length - 1);
    existingUnitTypeNamesRegex += ")).*$";
    this.unitTypeNameControl.setValidators([Validators.pattern(existingUnitTypeNamesRegex), Validators.required]);
    this.unitTypeNameControl.updateValueAndValidity();
  }












  /**
   * Dynamically creates the edit unit type component, which will be housed in the template with the id of 'edit_unit_type_container'.
   */
  saveUnitType(): void {
    // let editedUnitType = this.unitTypePanelService.selectedUnitType;
    // editedUnitType.name = this.editUnitTypeName.nativeElement.value;
    // editedUnitType.unit = this.editUnitTypeUnit.nativeElement.value;
    // editedUnitType.weight = Number (this.editUnitTypeWeight.nativeElement.value);
    //
    //
    // let goodUnitType = true;
    //
    // if (!(editedUnitType.name.length > 0)) {
    //   goodUnitType = false;
    // }
    //
    // //Ensure that the name is unique
    // if (!(this.unitTypeService.unitTypes.getValue().every(existingUnitType => {
    //   if (existingUnitType.id === editedUnitType.id) {
    //     return true;
    //   } else {
    //     return existingUnitType.name !== editedUnitType.name;
    //   }
    // }))) {
    //   goodUnitType = false;
    // }
    //
    // if (!(editedUnitType.unit.length > 0)) {
    //   goodUnitType = false;
    // }
    //
    // if (!(editedUnitType.weight >= 0)) {
    //   goodUnitType = false;
    // }
    // console.log(editedUnitType);
    //
    // if (goodUnitType) {
    //   this.unitTypeService.saveUnitType(editedUnitType).then( value => {
    //     this.destroyEditUnitTypeComponent();
    //   });
    // }
  }
}
