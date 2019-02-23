import { Component, OnInit } from '@angular/core';
import {ProjectEntriesService} from "../../../service/project-entries.service";
import {Project} from "../../../model/project";
import {UserAccount} from "../../../model/userAccount";
import {ProjectService} from "../../../service/project.service";

@Component({
  selector: 'app-project-entries-sidebar',
  templateUrl: './project-entries-sidebar.component.html',
  styleUrls: ['./project-entries-sidebar.component.scss']
})
export class ProjectEntriesSidebarComponent implements OnInit {

  constructor(public projectEntriesService: ProjectEntriesService, public projectService:ProjectService) { }

  ngOnInit() {
    this.projectEntriesService.getAllProjects().subscribe((data: Array<Project>) => {
      this.projectEntriesService.projects = data;
    });
  }

  displayProjectEntries(project: Project){
    this.projectEntriesService.getProjectById(project.id).subscribe((data:Project) => {
      this.projectEntriesService.selectedProject = data;

      this.projectEntriesService.displayProjectEntries();
    });
  }

}
