import {Component, OnInit} from '@angular/core';
import {UserAccountService} from "../../../service/user-account.service";
import {AddUserAccountComponent} from "../../modal/add-user-account/add-user-account.component";
import {MatDialog} from "@angular/material";

@Component({
  selector: 'app-user-account-sidebar',
  templateUrl: './user-account-sidebar.component.html',
  styleUrls: ['./user-account-sidebar.component.scss'],
})
export class UserAccountSidebarComponent implements OnInit {

  constructor(public dialog: MatDialog, private userAccountService: UserAccountService) {
  }

  ngOnInit() {

  }

  /**
   * Displays a Modal component for adding a new UserAccount.
   */
  openDialog(): void {
    this.dialog.open(AddUserAccountComponent);
  }
}
