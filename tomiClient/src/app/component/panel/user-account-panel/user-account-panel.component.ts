import { Component, OnInit } from '@angular/core';
import {UserAccountService} from "../../../service/user-account.service";
import {TeamService} from "../../../service/team.service";
import {UserAccount} from "../../../model/userAccount";

@Component({
  selector: 'app-user-account-panel',
  templateUrl: './user-account-panel.component.html',
  styleUrls: ['./user-account-panel.component.scss']
})
export class UserAccountPanelComponent implements OnInit {

  constructor(private userAccountService: UserAccountService, private teamService: TeamService) { }

  ngOnInit() {

  }
}
