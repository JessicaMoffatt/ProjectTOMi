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
  add_user_account_container: ViewContainerRef;

  constructor(public resolver: ComponentFactoryResolver, public userAccountSidebarService:UserAccountSidebarService, public userAccountService: UserAccountService) { }

  ngOnInit() {

    this.userAccountSidebarService.getAllUserAccounts().subscribe((data: Array<UserAccount>) => {
      this.userAccountSidebarService.userAccounts = data;
      this.userAccountSidebarService.filteredAccounts = data;
      this.userAccountService.userAccounts = data;
    });
  }

  displayUserAccount(userAccount:UserAccount) {
    this.userAccountSidebarService.getUserAccountById(userAccount.id).subscribe((data: UserAccount) => {
      this.userAccountSidebarService.selectedUserAccount = data;
    });
  }

  createAddUserAccountComponent() {
    this.add_user_account_container.clear();
    const factory = this.resolver.resolveComponentFactory(AddUserAccountComponent);
    this.userAccountSidebarService.ref = this.add_user_account_container.createComponent(factory);
  }

  updateUserAccountSidebarList(search) {
    this.userAccountSidebarService.filteredAccounts =
      this.userAccountSidebarService.userAccounts.filter(this.filterUserAccounts);
  }

  filterUserAccounts(user) {
    return user.firstName.toUpperCase().includes((<HTMLInputElement>document.getElementById("user_account_search")).value.toUpperCase()) ||
      user.lastName.toUpperCase().includes((<HTMLInputElement>document.getElementById("user_account_search")).value.toUpperCase());
  }
}
