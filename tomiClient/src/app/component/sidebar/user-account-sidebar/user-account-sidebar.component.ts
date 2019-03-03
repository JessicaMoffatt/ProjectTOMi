import {Component, ComponentFactoryResolver, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {UserAccountSidebarService} from "../../../service/user-account-sidebar-service";
import {UserAccountService} from "../../../service/user-account.service";
import {UserAccount} from "../../../model/userAccount";
import {AddUserAccountComponent} from "../../modal/add-user-account/add-user-account.component";

@Component({
  selector: 'app-user-account-sidebar',
  templateUrl: './user-account-sidebar.component.html',
  styleUrls: ['./user-account-sidebar.component.scss'],
})
export class UserAccountSidebarComponent implements OnInit {

  @ViewChild('add_user_account_container', {read: ViewContainerRef})
  public add_user_account_container: ViewContainerRef;

  constructor(public resolver: ComponentFactoryResolver, public userAccountSidebarService: UserAccountSidebarService, private userAccountService: UserAccountService) {
  }

  ngOnInit() {

  }

  /**
   * Selects the UserAccount that is passed in.
   * @param userAccount UserAccount to be selected.
   */
  displayUserAccount(userAccount: UserAccount) {
    this.userAccountSidebarService.getUserAccountById(userAccount.id).subscribe((data: UserAccount) => {
      this.userAccountSidebarService.selectedUserAccount = data;
    });
  }

  /**
   * Creates a Modal component for adding a new UserAccount.
   */
  createAddUserAccountComponent() {
    this.add_user_account_container.clear();
    const factory = this.resolver.resolveComponentFactory(AddUserAccountComponent);
    this.userAccountSidebarService.ref = this.add_user_account_container.createComponent(factory);
  }
}
