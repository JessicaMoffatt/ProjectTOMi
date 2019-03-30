import {Component, HostListener, Pipe, PipeTransform} from '@angular/core';
import {Input} from '@angular/core';
import {OnInit} from '@angular/core';
import {ViewChild} from "@angular/core";
import {ElementRef} from "@angular/core";
import {Observable} from 'rxjs';
import {MatDialog} from '@angular/material';
import {UnitType} from "../../../model/unitType";
import {UnitTypeService} from "../../../service/unit-type.service";
import {AddUnitTypeComponent} from "../../modal/add-unit-type/add-unit-type.component";
import {UserAccount} from "../../../model/userAccount";

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

  @HostListener('window:keyup.Enter', ['$event']) enter(e: KeyboardEvent) {
    e.preventDefault();
    console.log("panel");
  }
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
