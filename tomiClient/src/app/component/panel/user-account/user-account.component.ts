import {Component, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {UserAccountService} from "../../../service/user-account.service";
import {UserAccount} from "../../../model/userAccount";
import {TeamService} from "../../../service/team.service";

@Component({
  selector: 'app-user-account',
  templateUrl: './user-account.component.html',
  styleUrls: ['./user-account.component.scss']
})
export class UserAccountComponent implements OnInit {

  @ViewChild('componentHolder', {read: ViewContainerRef})
  entry_container: ViewContainerRef;

  constructor(public userAccountService: UserAccountService, public teamService: TeamService) { }

  ngOnInit() {

  }

  /**
   * Sets the selected UserAccount;
   * @param userAccount the UserAccount that has been selected.
   */
  selectUserAccount(userAccount: UserAccount) {
    this.userAccountService.setSelectedUserAccount(userAccount);
  }

  /**
   * Passes on the request to delete a UserAccount to the UserAccountService.
   * @param userAccount UserAccount to be deleted.
   */
  delete(userAccount: UserAccount) {
    this.userAccountService.delete(userAccount);
  }

  /**
   * Passes on the request to cancel changes made to the given UserAccount to the UserAccountService.
   * @param userAccount the UserAccount whose changes are to be canceled.
   */
  cancel(userAccount: UserAccount):void {
    this.userAccountService.cancel(userAccount);
  }

  editUserAccount(userAccount) {

  }
}
