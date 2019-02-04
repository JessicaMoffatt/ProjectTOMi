import {Component, ComponentFactoryResolver, OnInit} from '@angular/core';
import {UserAccountService} from "../../../service/user-account.service";
import {UserAccountSidebarService} from "../../../service/user-account-sidebar-service";
import {UserAccount} from "../../../model/userAccount";

@Component({
  selector: 'app-user-accounts',
  templateUrl: './user-accounts.component.html',
  styleUrls: ['./user-accounts.component.scss']
})
export class UserAccountsComponent implements OnInit {

  constructor(private resolver: ComponentFactoryResolver, public userAccountService: UserAccountService, public userAccountSidebarService: UserAccountSidebarService) { }

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
}
