import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {UserAccountService} from "../../../service/user-account.service";
import {AddUserAccountComponent} from "../../modal/add-user-account/add-user-account.component";
import {MatDialog} from "@angular/material";
import {UserAccount} from "../../../model/userAccount";

@Component({
  selector: 'app-user-account-sidebar',
  templateUrl: './user-account-sidebar.component.html',
  styleUrls: ['./user-account-sidebar.component.scss'],
})
export class UserAccountSidebarComponent implements OnInit {

  /** Event emitted when the user is selectedProject in the sidebar. */
  @Output() userSelectedEvent: EventEmitter<any> = new EventEmitter<any>();

  constructor(public dialog: MatDialog, private userAccountService: UserAccountService) { }

  ngOnInit() {

  }

  /** Pushes the selectedProject user. */
  userSelected(userAccount: UserAccount) {
    this.userSelectedEvent.emit(userAccount);
  }

  /**
   * Displays a Modal component for adding a new UserAccount.
   */
  openDialog(): void {
    this.dialog.open(AddUserAccountComponent);
  }
}
