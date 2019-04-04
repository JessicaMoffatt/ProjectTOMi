import {Component, Inject, OnInit} from '@angular/core';
import {MatDialog, MatSelectionList} from "@angular/material";
import {AddProjectMemberComponent} from "../../../modal/add-project-member/add-project-member.component";
import {ProjectService} from "../../../../service/project.service";
import {ProjectDetailComponent} from "../project-detail/project-detail.component";

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

  addMemberToProject() {
    this.dialog.open(AddProjectMemberComponent, {
      width: "70vw"
    });
  }

  deleteMembers(userAccounts: MatSelectionList) {
    userAccounts.selectedOptions.selected
      .forEach(each => this.projectService.removeUser(each.value));
  }
}
