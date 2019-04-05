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
 * @author Jessica Moffatt
 * @author Karol Talbot
 * @version 2.0
 */
@Component({
  selector: 'app-project-sidebar',
  templateUrl: './project-sidebar.component.html',
  styleUrls: ['./project-sidebar.component.scss']
})
export class ProjectSidebarComponent implements OnInit {
  @ViewChild("btn_group") buttonGroup:MatButtonToggleGroup;
  selected:boolean = false;

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
