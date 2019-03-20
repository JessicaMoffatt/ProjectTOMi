import {Component} from '@angular/core';
import {Input} from '@angular/core';
import {OnInit} from '@angular/core';
import {ViewChild} from "@angular/core";
import {ElementRef} from "@angular/core";
import {Observable} from 'rxjs';
import {MatDialog} from '@angular/material';
import {UnitType} from "../../../model/unitType";
import {UnitTypeService} from "../../../service/unit-type.service";
import {AddUnitTypeComponent} from "../../modal/add-unit-type/add-unit-type.component";

/**
 *
 *
 * @author Karol Talbot
 * @version 2.0
 */
@Component({
  selector: 'app-unit-type-panel',
  templateUrl: './unit-type-panel.component.html',
  styleUrls: ['./unit-type-panel.component.scss']
})
export class UnitTypePanelComponent implements OnInit{

  private unitType: UnitType;

  @Input() unitTypeSelectedEvent: Observable<UnitType>;

  @ViewChild('editUnitTypeComponent') editUnitTypeComponent : ElementRef;

  constructor(private dialog: MatDialog, private unitTypeService: UnitTypeService) { }

  ngOnInit() {
    this.unitTypeService.initializeUnitTypes();
  }


  delete(unitType:UnitType) {
    this.unitTypeService.DELETEUnitType(unitType);
  }


  save(unitType:UnitType) {
    this.unitTypeService.saveUnitType(unitType);
  }
  
  openDialog(): void {
    this.dialog.open(AddUnitTypeComponent, {
      width: "70vw",
      height: "70vh"
    });
  }
  
}
