import { Component, OnInit } from '@angular/core';
import {ExpenseService} from "../../../../service/expense.service";
import {TeamService} from "../../../../service/team.service";
import {UserAccountService} from "../../../../service/user-account.service";

@Component({
  selector: 'app-team-member-list',
  templateUrl: './team-member-list.component.html',
  styleUrls: ['./team-member-list.component.scss']
})
export class TeamMemberListComponent implements OnInit {

  constructor(public expenseService: ExpenseService, public userAccountService: UserAccountService) { }

  ngOnInit() {
  }

}
