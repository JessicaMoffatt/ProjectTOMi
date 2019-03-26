import {Component, OnInit, ViewChild} from '@angular/core';
import {UnitType} from "../../../model/unitType";
import {UnitTypeService} from "../../../service/unit-type.service";
import {ErrorStateMatcher, MatDialogRef} from "@angular/material";
import {FormControl, FormGroupDirective, NgForm, Validators} from "@angular/forms";

@Component({
  selector: 'app-add-unit-type',
  templateUrl: './add-unit-type.component.html',
  styleUrls: ['./add-unit-type.component.scss']
})
/**
 * AddUnitTypeComponent is a modal for adding new Unit Types.
 *
 * @author Iliya Kiritchkov
 * @author Karol Talbot
 * @version 1.1
 */
export class AddUnitTypeComponent implements OnInit {

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
  @ViewChild('addUnitTypeName') addUnitTypeName;

  /** The input field for the Unit Types's unit.*/
  @ViewChild('addUnitTypeUnit') addUnitTypeUnit;

  /** The input field for the Unit Types's weight.*/
  @ViewChild('addUnitTypeWeight') addUnitTypeWeight;

  /** The ngForm for this component. */
  @ViewChild('addUnitTypeForm') addUnitTypeForm;

  constructor(public dialogRef: MatDialogRef<AddUnitTypeComponent>, private unitTypeService: UnitTypeService) { }

  ngOnInit() {
    this.applyUniqueNameValidator();
  }

  /**
   * Dynamically generate a unique name regex pattern to ensure that new Unit Types have unique names.
   */
  applyUniqueNameValidator() {
    let existingUnitTypeNamesRegex = "^(?!.*(";
    //Add every existing unit type name to the regex
    this.unitTypeService.unitTypes.getValue().forEach(existingUnitType => {
      existingUnitTypeNamesRegex += "^" + existingUnitType.name + "$|";
    });
    //Remove the last | that was added in the forEach loop.
    existingUnitTypeNamesRegex = existingUnitTypeNamesRegex.substring(0, existingUnitTypeNamesRegex.length - 1);
    existingUnitTypeNamesRegex += ")).*$";
    this.unitTypeNameControl.setValidators([Validators.pattern(existingUnitTypeNamesRegex), Validators.required]);
    this.unitTypeNameControl.updateValueAndValidity();
  }

  /**
   * Adds a new Unit Type. Passes the request to save the new Unit Type to the UnitTypeService.
   */
  addUnitType() {
    if (this.unitTypeNameControl.valid && this.unitTypeUnitControl.valid && this.unitTypeWeightControl.valid) {

      let unitTypeToAdd = new UnitType();
      unitTypeToAdd.name = this.addUnitTypeName.nativeElement.value;
      unitTypeToAdd.unit = this.addUnitTypeUnit.nativeElement.value;
      unitTypeToAdd.weight = Number (this.addUnitTypeWeight.nativeElement.value);

      this.unitTypeService.saveUnitType(unitTypeToAdd);
      this.dialogRef.close();
    }
  }

  /**
   * Closes the modal component.
   */
  onNoClick(): void {
    this.dialogRef.close();
  }
}

/** Inner class for error detection of the Angular Material input fields. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || isSubmitted));
  }
}
