import {Component, Inject, OnInit, Pipe, PipeTransform, ViewChild} from '@angular/core';
import {ProjectService} from "../../../service/project.service";
import {ManageProjectsPanelComponent} from "../../panel/manage-projects-panel/manage-projects-panel.component";
import {Project} from "../../../model/project";
import {BehaviorSubject} from "rxjs";
import {UserAccount} from "../../../model/userAccount";
import {Team} from "../../../model/team";
import {ManageTeamsPanelComponent} from "../../panel/manage-teams-panel/manage-teams-panel.component";

@Component({
  selector: 'app-project-sidebar',
  templateUrl: './project-sidebar.component.html',
  styleUrls: ['./project-sidebar.component.scss']
})
export class ProjectSidebarComponent implements OnInit {
  @ViewChild("btn_group") buttonGroup;

  constructor(@Inject(ManageTeamsPanelComponent) private parent: ManageTeamsPanelComponent, public projectService: ProjectService) { }

  ngOnInit() {
    this.projectService.refreshProjectList();
  }

  displayBlankProject() {
    this.projectService.setSelected(new Project());
    this.projectService.userAccountList = new BehaviorSubject<Array<UserAccount>>([]);
  }

  selectProject(project : Project){
    this.projectService.setSelected(project);
  }

  public unselect(projectId: number): void {
    this.buttonGroup.selected.checked = false;
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
