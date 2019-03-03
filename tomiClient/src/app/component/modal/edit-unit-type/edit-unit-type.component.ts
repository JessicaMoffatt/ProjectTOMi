import {Component, ComponentFactoryResolver, Input, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {UnitTypePanelService} from "../../../service/unit-type-panel.service";
import {AddTaskComponent} from "../add-task/add-task.component";

@Component({
  selector: 'app-edit-unit-type',
  templateUrl: './edit-unit-type.component.html',
  styleUrls: ['./edit-unit-type.component.scss']
})
export class EditUnitTypeComponent implements OnInit {

  /** A view container ref for the template that will be used to house the edit unit type component. */
  @Input() @ViewChild('edit_unit_type_container', {read: ViewContainerRef})
  edit_unit_type_container: ViewContainerRef;

  constructor( public unitTypePanelService: UnitTypePanelService, private resolver: ComponentFactoryResolver) { }

  ngOnInit() {

  }

  /**
   * Dynamically creates the edit unit type component, which will be housed in the template with the id of 'edit_unit_type_container'.
   */
  createEditUnitTypeComponent() {
    this.edit_unit_type_container.clear();
    const factory = this.resolver.resolveComponentFactory(AddTaskComponent);
    this.unitTypePanelService.ref = this.edit_unit_type_container.createComponent(factory);
  }

  /**
   * Destroys the dynamically created edit unit type component.
   */
  destroyEditUnitTypeComponent() {
    this.unitTypePanelService.destroyEditUnitTypeComponent();
  }

}
