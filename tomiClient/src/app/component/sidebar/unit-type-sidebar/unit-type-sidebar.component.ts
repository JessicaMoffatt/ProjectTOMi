import {Component, ComponentFactoryResolver, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {UnitTypeService} from "../../../service/unit-type.service";
import {AddUnitTypeComponent} from "../../modal/add-unit-type/add-unit-type.component";
import {UnitTypeSidebarService} from "../../../service/unit-type-sidebar.service";

@Component({
  selector: 'app-unit-type-sidebar',
  templateUrl: './unit-type-sidebar.component.html',
  styleUrls: ['./unit-type-sidebar.component.scss']
})
export class UnitTypeSidebarComponent implements OnInit {

  @ViewChild('add_unit_type', {read: ViewContainerRef})
  add_unit_type: ViewContainerRef;

  constructor(public unitTypeSidebarService: UnitTypeSidebarService, public unitTypeService: UnitTypeService, public resolver: ComponentFactoryResolver) { }

  ngOnInit() {
  }

  createAddUnitTypeComponent() {
    this.add_unit_type.clear();
    this.unitTypeSidebarService.ref = this.add_unit_type.createComponent(this.resolver.resolveComponentFactory(AddUnitTypeComponent));
  }
}
