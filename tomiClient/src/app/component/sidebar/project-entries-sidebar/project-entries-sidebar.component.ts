import {Component, HostListener, Inject, OnInit, ViewChild} from '@angular/core';
import {Project} from "../../../model/project";
import {ApprovePanelComponent} from "../../panel/approve-panel/approve-panel.component";
import {ProjectService} from "../../../service/project.service";

/**
 * ProjectEntriesSidebarComponent is used to house the list of projects whose entries are to be viewed.
 *
 * @author Jessica Moffatt
 * @version 2.0
 */
@Component({
  selector: 'app-project-entries-sidebar',
  templateUrl: './project-entries-sidebar.component.html',
  styleUrls: ['./project-entries-sidebar.component.scss']
})
export class ProjectEntriesSidebarComponent implements OnInit {
  @ViewChild("btn_group") btn_group;

  @HostListener('window:keydown.Control.f', ['$event']) w(e: KeyboardEvent) {
    e.preventDefault();
    document.getElementById("project_entry_search").focus();
  }
  constructor(@Inject(ApprovePanelComponent) private parent: ApprovePanelComponent,
              public projectService:ProjectService) {
  }

  ngOnInit() {
    this.projectService.refreshProjectList();
  }

  /**
   * Sets the selected Project.
   * @param project The Project to set selected to.
   */
  selectProject(project: Project): void {
    this.parent.setSelectedProject(project);
  }

  /**
   * Unselects the project.
   * @param projectId
   */
  public unselect(projectId:string){
    this.btn_group.selected.checked = false;
  }

  /**
   * Gets the Entries for this Project.
   * @param project The Project to get Entries for.
   */
  public getProjectEntries(project:Project){
    this.parent.setSelectedProject(project);
  }
}

