import {Component, ComponentFactoryResolver, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {UserAccountSidebarService} from "../../../service/user-account-sidebar-service";
import {UserAccountService} from "../../../service/user-account.service";
import {AddUserAccountComponent} from "../../modal/add-user-account/add-user-account.component";
import {MatDialog} from "@angular/material";

@Component({
  selector: 'app-user-account-sidebar',
  templateUrl: './user-account-sidebar.component.html',
  styleUrls: ['./user-account-sidebar.component.scss'],
})
export class UserAccountSidebarComponent implements OnInit {

  @ViewChild('add_user_account_container', {read: ViewContainerRef})
  public add_user_account_container: ViewContainerRef;

  /** Demo variables to be removed*/
  animal: String;
  name: String;

  constructor(public dialog: MatDialog, public resolver: ComponentFactoryResolver, public userAccountSidebarService: UserAccountSidebarService, private userAccountService: UserAccountService) {
  }

  ngOnInit() {

  }

  openDialog(): void {
    const dialogRef = this.dialog.open(AddUserAccountComponent, {
      // width: '250px',
      data: {name: this.name, animal: this.animal}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.animal = result;
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
