import {Component, EventEmitter, Inject, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {FormControl, Validators} from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material";
import {UnitType} from "../../../model/unitType";

/**
 *
 *
 * @author Karol Talbot
 * @version 1.1
 */
@Component({
  selector: 'app-edit-unit-type',
  templateUrl: './edit-unit-type.component.html',
  styleUrls: ['./edit-unit-type.component.scss']
})
export class EditUnitTypeComponent implements OnInit, OnDestroy {

  /** Validations for the name. */
  unitTypeNameControl = new FormControl('', [
    Validators.required
  ]);

  unitTypeUnitControl = new FormControl('', [
    Validators.required
  ]);

  unitTypeWeightControl = new FormControl('', [
    Validators.required
  ]);

  /** The UnitTypeSubject model associated with this component. */
  @Input() unitType: UnitType;
  /** Event Emitter used to notify the UnitTypeComponent parent that the EditUnitTypeComponent save had been requested. */
  @Output() saveRequested = new EventEmitter<any>();
  /** Event Emitter used to notify the UnitTypeComponent parent that the EditUnitTypeComponent delete had been requested. */
  @Output() deleteRequested = new EventEmitter<any>();
  /** Event Emitter used to notify the UnitTypeComponent parent that the EditUnitTypeComponent cancel had been requested. */
  @Output() cancelRequested = new EventEmitter<any>();

  /** The expansion panel for this UnitTypeSubject. */
  @ViewChild('editUnitTypeExpansionPanel') editUnitTypeExpansionPanel;

  /** The input field for the UnitType's name.*/
  @ViewChild('editUnitTypeName') editUnitTypeName;

  @ViewChild('editUnitTypeUnit') editUnitTypeUnit;

  @ViewChild('editUnitTypeWeight') editUnitTypeWeight;

  /** The ngForm for this component */
  @ViewChild('editUnitTypeForm') editUnitTypeForm;


  constructor(public deleteUnitTypeDialog: MatDialog) {
  }

  ngOnInit() {

  }

  ngOnDestroy(): void {

  }


  /**
   * Initialize the value inputs on the template. This fixes issues caused by the Validators.required when an input is pristine.
   */
  setValuesOnOpen() {
    this.unitTypeNameControl.setValue(this.unitType.name);
    this.unitTypeUnitControl.setValue(this.unitType.unit);
    this.unitTypeWeightControl.setValue(this.unitType.weight);
  }

  /**
   * Emits a request for this UnitType's changes to be saved.
   */
  save():void {
    if (this.unitTypeNameControl.valid && this.unitTypeUnitControl.valid && this.unitTypeWeightControl.valid) {
        this.unitType.name = this.editUnitTypeName.nativeElement.value;
        this.unitType.unit = this.editUnitTypeUnit.nativeElement.value;
        this.unitType.weight = this.editUnitTypeWeight.nativeElement.value;

        this.editUnitTypeExpansionPanel.toggle();
        this.saveRequested.emit(this.unitType);
    }
  }

  /**
   * Emits a request for this UnitType to be deleted.
   */
  delete():void {
    this.editUnitTypeExpansionPanel.toggle();
    this.deleteRequested.emit(this.unitType);
  }

  /**
   * Emits a request for this UnitType's changes to be cancelled.
   */
  cancel():void {
    this.editUnitTypeExpansionPanel.toggle();
  }

  openDeleteDialog() {
    this.deleteUnitTypeDialog.open(DeleteUnitTypeModal, {
      width: '40vw',
      data: {unitTypeToDelete: this.unitType, parent: this}
    });
  }
}

@Component({
  selector: 'app-delete-unit-type-modal',
  templateUrl: './delete-unit-type-modal.html',
  styleUrls: ['./delete-unit-type-modal.scss']
})
/** Inner class for confirmation modal of delete UnitType. */
export class DeleteUnitTypeModal {
  unitTypeToDelete: UnitType;

  constructor(public dialogRef: MatDialogRef<DeleteUnitTypeModal>, @Inject(MAT_DIALOG_DATA) public data: DeleteDialogData) {

  }

  ngOnInit() {
    this.unitTypeToDelete = this.data.unitTypeToDelete;
  }

  canceledDelete(): void {
    this.dialogRef.close();
  }

  confirmedDelete() {
    this.data.parent.delete();
    this.dialogRef.close();
  }
}

/** Data interface for the DeleteUnitTypeModal */
export interface DeleteDialogData {
  unitTypeToDelete : UnitType;
  parent: EditUnitTypeComponent;
}


