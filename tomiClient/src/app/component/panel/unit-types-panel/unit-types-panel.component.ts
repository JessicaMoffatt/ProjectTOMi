import { Component, OnInit } from '@angular/core';
import {UnitTypeService} from "../../../service/unit-type.service";

@Component({
  selector: 'app-unit-types-panel',
  templateUrl: './unit-types-panel.component.html',
  styleUrls: ['./unit-types-panel.component.css']
})
export class UnitTypesPanelComponent implements OnInit {

  constructor(public unitTypeService: UnitTypeService) { }

  ngOnInit() {
  }
}
