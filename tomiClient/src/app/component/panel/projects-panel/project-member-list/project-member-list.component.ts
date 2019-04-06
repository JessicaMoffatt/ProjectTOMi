import {Component, Inject, OnInit} from '@angular/core';
import {MatDialog, MatSelectionList} from "@angular/material";
import {AddProjectMemberComponent} from "../../../modal/add-project-member/add-project-member.component";
import {ProjectService} from "../../../../service/project.service";
import {ProjectDetailComponent} from "../project-detail/project-detail.component";

/**
 * ProjectMemberListComponent is used to facilitate communication between the project member view and front end services.
 * @author James Andrade
 * @author Karol Talbot
 */
@Component({
  selector: 'app-project-member-list',
  templateUrl: './project-member-list.component.html',
  styleUrls: ['./project-member-list.component.scss']
})
export class ProjectMemberListComponent implements OnInit {

  constructor(public dialog: MatDialog, public projectService: ProjectService,
              @Inject(ProjectDetailComponent) private parent: ProjectDetailComponent) {
  }

  ngOnInit() {

  }

  /**
   *  Displays a Modal component for adding a new member to this Project.
   */
  addMemberToProject() {
    this.dialog.open(AddProjectMemberComponent, {
      width: "50vw"
    });
  }

  /**
   * Removes the specified UserAccounts from this Project.
   * @param userAccounts The list of UserAccounts to be removed from this Project.
   */
  deleteMembers(userAccounts: MatSelectionList) {
    userAccounts.selectedOptions.selected
      .forEach(each => this.projectService.removeUser(each.value));
  }
}
