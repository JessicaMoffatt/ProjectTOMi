import { Component, OnInit } from '@angular/core';
import {ProjectService} from "../../../service/project.service";
import {ProjectsPanelComponent} from "../../panel/projects-panel/projects-panel.component";
import {Project} from "../../../model/project";
import {BehaviorSubject} from "rxjs";
import {UserAccount} from "../../../model/userAccount";

@Component({
  selector: 'app-project-sidebar',
  templateUrl: './project-sidebar.component.html',
  styleUrls: ['./project-sidebar.component.scss']
})
export class ProjectSidebarComponent implements OnInit {

  constructor(private projectsPanel: ProjectsPanelComponent, public projectService: ProjectService) { }

  ngOnInit() {
    this.projectService.initializeProjects();
  }

  displayBlankProject() {
    this.projectService.setSelected(null);
    this.projectService.userAccountList = new BehaviorSubject<Array<UserAccount>>([]);
    this.projectsPanel.subPanelDisplay = "manageProject";
  }

  viewProductivityReport() {
    this.projectsPanel.subPanelDisplay = "productivityReport";
  }

  selectProject(p : Project){
    this.projectService.setSelected(p);
    this.projectsPanel.subPanelDisplay = "manageProject";
  }
}
