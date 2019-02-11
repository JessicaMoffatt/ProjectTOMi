import {
  Component,
  OnInit,
} from '@angular/core';
import {UserAccountSidebarService} from "../../../service/user-account-sidebar-service";
import {UserAccountService} from "../../../service/user-account.service";
import {UserAccount} from "../../../model/userAccount";
import {TeamSidebarService} from "../../../service/team-sidebar.service";
import {Team} from "../../../model/team";
import {TeamService} from "../../../service/team.service";

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
  constructor(private userAccountSidebarService: UserAccountSidebarService, private userAccountService: UserAccountService, private teamService: TeamService) { }

  ngOnInit() {
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
    } else {
      // Capitalize the first character of the first and last name are capitalized
      userAccount.firstName = userAccount.firstName.charAt(0).toUpperCase() + userAccount.firstName.substring(1);
      userAccount.lastName = userAccount.lastName.charAt(0).toUpperCase() + userAccount.lastName.substring(1);
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
    this.teamService.teamsObservable.subscribe(teams => {
      teams.forEach( team => {
        if (userAccount.teamId === team.id) {
          validTeamId = true;
        }
      })
    });

    // Save the new UserAccount if it has been fully validated.
    if (goodUserAccount) {
      this.userAccountService.save(userAccount).then(value => {
        this.destroyAddUserAccountComponent();
        this.userAccountService.refreshUserAccounts();
      });
    }
  }

  /**r
   * Destroys the dynamically created Add UserAccount component.
   */
  destroyAddUserAccountComponent() {
    this.userAccountSidebarService.destroyAddUserAccountComponent();
  }
}


