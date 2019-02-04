import {Component, ComponentFactoryResolver, OnInit, ViewContainerRef} from '@angular/core';
import {UserAccountSidebarService} from "../../../service/user-account-sidebar-service";
import {UserAccountService} from "../../../service/user-account.service";
import {UserAccount} from "../../../model/userAccount";

@Component({
  selector: 'app-user-account-sidebar',
  templateUrl: './user-account-sidebar.component.html',
  styleUrls: ['./user-account-sidebar.component.scss']
})
export class UserAccountSidebarComponent implements OnInit {

  add_user_account_container: ViewContainerRef;

  constructor(private resolver: ComponentFactoryResolver, private userAccountSidebarService:UserAccountSidebarService, private userAccountService: UserAccountService) { }

  ngOnInit() {

    this.userAccountSidebarService.getAllUserAccounts().subscribe((data: Array<UserAccount>) => {
      this.userAccountSidebarService.userAccounts = data;
      this.userAccountService.userAccounts = data;
    });
  }

  displayUserAccount(userAccount:UserAccount) {
    this.userAccountSidebarService.getUserAccountById(userAccount.id).subscribe((data: UserAccount) => {
      this.userAccountSidebarService.selectedUserAccount = data;
    });
  }

  // createAddUserAccountComponent() {
  //   this.add_user_account_container.clear();
  //     const factory = this.resolver.resolveComponentFactory(AddUserAccountComponent);
  //     this.userAccountSidebarService.ref = this.add_user_account_container.createComponent(factory);
  // }
}
