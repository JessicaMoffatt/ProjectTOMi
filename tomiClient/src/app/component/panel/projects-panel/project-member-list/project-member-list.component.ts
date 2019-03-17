import { Component, OnInit } from '@angular/core';
import {ExpenseService} from "../../../../service/expense.service";
import {TeamService} from "../../../../service/team.service";
import {UserAccountService} from "../../../../service/user-account.service";
import {MatDialog} from "@angular/material";
import {AddProjectMemberComponent} from "../../../modal/add-project-member/add-project-member.component";
import {ProjectService} from "../../../../service/project.service";

@Component({
  selector: 'app-project-member-list',
  templateUrl: './project-member-list.component.html',
  styleUrls: ['./project-member-list.component.scss']
})
export class ProjectMemberListComponent implements OnInit {

  constructor(public dialog: MatDialog, public expenseService: ExpenseService, public userAccountService: UserAccountService) { }

  ngOnInit() {
  }

  addMemberToProject(){

    this.dialog.open(AddProjectMemberComponent);
    console.log("you clicked open");
  }

}
