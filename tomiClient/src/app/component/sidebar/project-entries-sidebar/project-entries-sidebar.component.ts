import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {ProjectEntriesService} from "../../../service/project-entries.service";
import {Project} from "../../../model/project";
import {ApprovePanelComponent} from "../../panel/approve-panel/approve-panel.component";

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
  @ViewChild("btn_group") btn_group;

  constructor(@Inject(ApprovePanelComponent) private parent: ApprovePanelComponent,
              public projectEntriesService:ProjectEntriesService) {
  }

  ngOnInit() {
    this.projectEntriesService.getAllProjects();
  }

  selectProject(project: Project): void {
    this.parent.setSelectedProject(project);
  }

  public unselect(teamId:number){
    this.btn_group.selected.checked = false;
    console.log(this.btn_group);
  }
}
