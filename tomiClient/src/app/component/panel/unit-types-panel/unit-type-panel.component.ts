import {Component, HostListener, Pipe, PipeTransform} from '@angular/core';
import {OnInit} from '@angular/core';
import {ViewChild} from "@angular/core";
import {ElementRef} from "@angular/core";
import {MatDialog} from '@angular/material';
import {UnitType} from "../../../model/unitType";
import {UnitTypeService} from "../../../service/unit-type.service";
import {AddUnitTypeComponent} from "../../modal/add-unit-type/add-unit-type.component";

/**
 * UnitTypePanelComponent is used to facilitate communication between the manage unit types view and front end services.
 * @author Karol Talbot
 * @version 2.0
 */
@Component({
  selector: 'app-unit-type-panel',
  templateUrl: './unit-type-panel.component.html',
  styleUrls: ['./unit-type-panel.component.scss']
})
export class UnitTypePanelComponent implements OnInit{

  /**
   * The UnitType being viewed.
   */
  private unitType: UnitType;

  /**
   * The edit unit type component within this unit type panel component.
   */
  @ViewChild('editUnitTypeComponent') editUnitTypeComponent : ElementRef;

  /**
   * Listens for the Ctrl+f key's keydown event; Moves focus to the search bar on that event.
   * @param e The event captured.
   */
  @HostListener('window:keydown.Control.f', ['$event']) w(e: KeyboardEvent) {
    e.preventDefault();
    document.getElementById("unit_type_search").focus();
  }

  constructor(private dialog: MatDialog, private unitTypeService: UnitTypeService) { }

  ngOnInit() {
    this.unitTypeService.initializeUnitTypes();
  }

  /**
   * Passes on the request to delete a UnitType to the UnitTypeService.
   * @param unitType
   */
  delete(unitType:UnitType) {
    this.unitTypeService.deleteUnitType(unitType);
  }

  /**
   * Passes on the request to save a UnitType to the UnitTypeService.
   * @param unitType
   */
  save(unitType:UnitType) {
    this.unitTypeService.saveUnitType(unitType);
  }

  /**
   * Displays a Modal component for adding a new UnitType.
   */
  openDialog(): void {
    this.dialog.open(AddUnitTypeComponent, {
      width: "70vw"
    });
  }
}

/**
 * Pipe used to filter UnitTypes by their name.
 */
@Pipe({name: 'FilterUnitTypeByName'})
export class FilterUnitTypeByName implements PipeTransform {
  transform(unitTypeList: Array<UnitType>, nameFilter: string): any {
    nameFilter = nameFilter.toLowerCase();
    if (!nameFilter) return unitTypeList;

    return unitTypeList.filter(n => {
      let name = n.name;
      name = name.toLowerCase();

      return name.indexOf(nameFilter) >= 0;
    });
  }
}
