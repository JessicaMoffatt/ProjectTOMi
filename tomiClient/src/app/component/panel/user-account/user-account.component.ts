import {Component, ElementRef, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {UserAccountService} from "../../../service/user-account.service";
import {UserAccount} from "../../../model/userAccount";
import {TeamService} from "../../../service/team.service";
import set = Reflect.set;

@Component({
  selector: 'app-user-account',
  templateUrl: './user-account.component.html',
  styleUrls: ['./user-account.component.scss']
})
export class UserAccountComponent implements OnInit {

  @ViewChild('componentHolder', {read: ViewContainerRef})
  entry_container: ViewContainerRef;

  @ViewChild('viewUserComponent') viewUserComponent : ElementRef;

  @ViewChild('editUserComponent') editUserComponent : ElementRef;

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
  cancel(userAccount: UserAccount) {
    document.getElementById('view_user_account' + userAccount.id).className = "view_user_visible";
    document.getElementById('edit_user_account' + userAccount.id).className = "edit_user_hidden";
  }

  /**
   *
   * @param userAccount
   */
  editUserAccount(userAccount) {
    document.getElementById('view_user_account' + userAccount.id).className = "view_user_hidden";
    document.getElementById('edit_user_account' + userAccount.id).className = "edit_user_visible";
  }

  /**
   *
   * @param userAccount
   */
  save(userAccount: UserAccount) {
    this.userAccountService.save(userAccount);
    this.cancel(userAccount);
  }
}
