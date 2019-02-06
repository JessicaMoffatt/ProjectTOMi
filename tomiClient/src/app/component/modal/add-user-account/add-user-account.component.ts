import {
  Component,
  OnInit,
} from '@angular/core';
import {UserAccountSidebarService} from "../../../service/user-account-sidebar-service";
import {UserAccountService} from "../../../service/user-account.service";
import {UserAccount} from "../../../model/userAccount";
import {TeamSidebarService} from "../../../service/team-sidebar.service";
import {Team} from "../../../model/team";

/**
 * AddUserAccountComponent is a modal form used to add a new UserAccount to the database.
 *
 * @author Iliya Kiritchkov
 * @version 1.0
 */
@Component({
  selector: 'app-add-user-account',
  templateUrl: './add-user-account.component.html',
  styleUrls: ['./add-user-account.component.scss']
})
export class AddUserAccountComponent implements OnInit {
  teams: Team[];
  constructor(private userAccountSidebarService: UserAccountSidebarService, private userAccountService: UserAccountService, private teamSidebarService: TeamSidebarService ) { }

  ngOnInit() {
    this.teamSidebarService.getAllTeams().subscribe((data: Array<Team>) => {
      this.teams = data;
    });
  }

  /**
   * Adds a new UserAccount. Passes the request to save the new UserAccount to the UserAccountService.
   */
  addUserAccount() {
    let userAccount = new UserAccount();
    userAccount.firstName = (<HTMLInputElement>document.getElementById("user_account_to_add_first_name")).value;
    userAccount.lastName = (<HTMLInputElement>document.getElementById("user_account_to_add_last_name")).value;
    userAccount.email = (<HTMLInputElement>document.getElementById("user_account_to_add_email")).value;
    userAccount.salariedRate = Number((<HTMLInputElement>document.getElementById("user_account_to_add_rate")).value);
    userAccount.teamId = Number((<HTMLInputElement>document.getElementById("user_account_to_add_team")).value);

    let goodUserAccount = true;
    let nameRegex = /^[a-zA-Z ]{1,255}$/;

    // Validate the first and last names
    if (!nameRegex.test(userAccount.firstName) || !nameRegex.test(userAccount.lastName)) {
      goodUserAccount = false;
    }

    // Validate length of email address
    if (!(userAccount.email.length > 1)) {
      goodUserAccount = false;
    }

    // Validate salaried rate
    // If valid, multiply by 100 to change from pennies to dollars.
    if (!(userAccount.salariedRate > 0)) {
      goodUserAccount = false;
    } else {
      userAccount.salariedRate *= 100;
    }

    // Validate the team id chosen by comparing to all of the existing team ids.
    let validTeamId = false;
    for (let i = 0; i < this.teams.length; i++) {
      if (this.teams[i].id === userAccount.teamId) {
        validTeamId = true;
      }
    }

    // Validate the team id chosen if it is the new teamId magic number "-1".
    if (userAccount.teamId === -1) {
      validTeamId = true;
    }

    //
    if (!validTeamId) {
      goodUserAccount = false;
    }

    // Save the new UserAccount if it has been fully validated.
    if (goodUserAccount) {
      this.userAccountService.save(userAccount).then(value => {
        this.userAccountService.userAccounts.push(value);
        this.destroyAddUserAccountComponent();
      });
    }
  }

  /**
   * Destroys the dynamically created Add UserAccount component.
   */
  destroyAddUserAccountComponent() {
    this.userAccountSidebarService.destroyAddUserAccountComponent();
  }
}
