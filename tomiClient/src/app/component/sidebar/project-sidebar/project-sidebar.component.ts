import {Component, HostListener, Inject, OnInit, Pipe, PipeTransform, ViewChild} from '@angular/core';
import {ProjectService} from "../../../service/project.service";
import {ProjectsPanelComponent} from "../../panel/projects-panel/projects-panel.component";
import {Project} from "../../../model/project";
import {BehaviorSubject} from "rxjs";
import {UserAccount} from "../../../model/userAccount";
import {Team} from "../../../model/team";
import {ManageTeamsPanelComponent} from "../../panel/manage-teams-panel/manage-teams-panel.component";
import {MatButtonToggle, MatButtonToggleGroup} from "@angular/material";

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

  displayBlankProject() {
    this.projectService.setSelected(new Project());
    this.projectService.userAccountList = new BehaviorSubject<Array<UserAccount>>([]);
  }

  selectProject(project : Project){
    this.selected = true;
    this.projectService.setSelected(project);
  }

  unselect(){
    this.selected = false;
    if (this.buttonGroup.selected instanceof MatButtonToggle) {
      this.buttonGroup.selected.checked = false;
    }
  }

  checkSelected(){
    return this.selected;
  }

}

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
