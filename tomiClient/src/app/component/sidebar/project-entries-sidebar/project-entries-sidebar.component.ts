import { Component, OnInit } from '@angular/core';
import {ProjectEntriesService} from "../../../service/project-entries.service";
import {Project} from "../../../model/project";

/**
 * ProjectEntriesSidebarComponent is used to display the list of projects for a user to interact with when viewing entries for approval.
 *
 * @author Jessica Moffatt
 * @version 1.0
 */
@Component({
  selector: 'app-project-entries-sidebar',
  templateUrl: './project-entries-sidebar.component.html',
  styleUrls: ['./project-entries-sidebar.component.scss']
})
export class ProjectEntriesSidebarComponent implements OnInit {

  constructor(public projectEntriesService: ProjectEntriesService) { }

  ngOnInit() {
    this.projectEntriesService.getAllProjects().subscribe((data: Array<Project>) => {
      this.projectEntriesService.projects = data;
    });
  }

  /**
   * Displays the entries for a specified project.
   * @param project The project to display entries for.
   */
  displayProjectEntries(project: Project){
    this.projectEntriesService.getProjectById(project.id).subscribe((data:Project) => {
      this.projectEntriesService.selectedProject = data;

      this.projectEntriesService.displayProjectEntries().then();
    });
  }
}
