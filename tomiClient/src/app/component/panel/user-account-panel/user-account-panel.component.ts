import {Component, OnInit} from '@angular/core';
import {UserAccountService} from "../../../service/user-account.service";
import {TeamService} from "../../../service/team.service";
import {UserAccount} from "../../../model/userAccount";
import {Subject} from "rxjs";

@Component({
  selector: 'app-user-account-panel',
  templateUrl: './user-account-panel.component.html',
  styleUrls: ['./user-account-panel.component.scss']
})
export class UserAccountPanelComponent implements OnInit {

  /** Subject that pushes the selectedProject user account from the sidebar. */
  public selectedEventSubject: Subject<UserAccount> = new Subject<UserAccount>();

  constructor(private userAccountService: UserAccountService, private teamService: TeamService) { }

  ngOnInit() {
    this.teamService.refreshTeams();
    this.userAccountService.initializeUserAccounts();
  }

  /** Pushes the selectedProject user. */
  userSelected(userAccount: UserAccount) {
    this.selectedEventSubject.next(userAccount);
  }
}
