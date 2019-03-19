import {Component, OnInit} from '@angular/core';
import {UnitTypeService} from "../../../service/unit-type.service";
import {AddUnitTypeComponent} from "../../modal/add-unit-type/add-unit-type.component";
import {MatDialog} from "@angular/material";

@Component({
  selector: 'app-unit-type-sidebar',
  templateUrl: './unit-type-sidebar.component.html',
  styleUrls: ['./unit-type-sidebar.component.scss']
})
/**
 * UnitTypeSidebarComponent is responsible for the activity in the Manage Unit Types Sidebar.
 *
 * @author Iliya Kiritchkov
 * @version 1.1
 */
export class UnitTypeSidebarComponent implements OnInit {

  constructor(public dialog: MatDialog, public unitTypeService: UnitTypeService) { }

  ngOnInit() {

  }

  /**
   * Displays a Modal component for adding a new Unit Type.
   */

  openDialog(): void {
    this.dialog.open(AddUnitTypeComponent);
  }
}
