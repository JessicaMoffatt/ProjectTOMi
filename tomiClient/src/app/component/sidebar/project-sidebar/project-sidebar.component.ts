import {Component, HostListener, Inject, OnInit, Pipe, PipeTransform, ViewChild} from '@angular/core';
import {ProjectService} from "../../../service/project.service";
import {ProjectsPanelComponent} from "../../panel/projects-panel/projects-panel.component";
import {Project} from "../../../model/project";
import {BehaviorSubject} from "rxjs";
import {UserAccount} from "../../../model/userAccount";
import {MatButtonToggle, MatButtonToggleGroup} from "@angular/material";

/**
 * ProjectSidebarComponent is used to house the list of projects to be managed.
 *
 * @author James Andrade
 * @author Karol Talbot
 * @version 2.0
 */
@Component({
  selector: 'app-project-sidebar',
  templateUrl: './project-sidebar.component.html',
  styleUrls: ['./project-sidebar.component.scss']
})
export class ProjectSidebarComponent implements OnInit {
  /**
   * The button group for displaying all the projects.
   */
  @ViewChild("btn_group") buttonGroup:MatButtonToggleGroup;

  /**
   * Represents whether a project has been selected of not.
   */
  selected:boolean = false;

  /**
   * Listens for the Ctrl+f key's keydown event; Moves focus to the search bar on that event.
   * @param e The event captured.
   */
  @HostListener('window:keydown.Control.f', ['$event']) w(e: KeyboardEvent) {
    e.preventDefault();
    document.getElementById("project_search").focus();
  }
  constructor(public projectService: ProjectService,
              @Inject(ProjectsPanelComponent) private parent:ProjectsPanelComponent) { }

  ngOnInit() {
    this.projectService.refreshProjectList();
  }

  /**
   * Sets the selected Project.
   * @param project The Project to set selected to.
   */
  selectProject(project : Project){
    this.selected = true;
    this.projectService.setSelected(project);
  }

  /**
   * Checks the value of selected.
   */
  checkSelected(){
    return this.selected;
  }

  unselect(){
    this.selected = false;
    if (this.buttonGroup.selected instanceof MatButtonToggle) {
      this.buttonGroup.selected.checked = false;
    }
  }
}

/**
 * Pipe used to filter Projects by their name.
 */
@Pipe({name: 'FilterProjectByName'})
export class FilterProjectByName implements PipeTransform {
  transform(projectList: Array<Project>, nameFilter: string): any {
    nameFilter = nameFilter.toLowerCase();
    if (!nameFilter) return projectList;

    return projectList.filter(n => {
      let name = n.projectName;
      name = name.toLowerCase();

      return name.indexOf(nameFilter) >= 0;
    });
  }
}
