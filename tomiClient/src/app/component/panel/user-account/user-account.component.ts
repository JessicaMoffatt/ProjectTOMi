import {Component, ElementRef, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {UserAccountService} from "../../../service/user-account.service";
import {UserAccount} from "../../../model/userAccount";
import {Observable, Subject, Subscription} from "rxjs";
import {AddUserAccountComponent} from "../../modal/add-user-account/add-user-account.component";
import {MatDialog} from "@angular/material";
import {TeamService} from "../../../service/team.service";

/**
 * @author Karol Talbot
 * @author Iliya Kiritchkov
 */
@Component({
  selector: 'app-user-account',
  templateUrl: './user-account.component.html',
  styleUrls: ['./user-account.component.scss']
})
export class UserAccountComponent implements OnInit, OnDestroy {

  private userAccount: UserAccount;

  @Input() userSelectedEvent: Observable<UserAccount>;

  @ViewChild('editUserComponent') editUserComponent : ElementRef;

  constructor(private dialog: MatDialog, private userAccountService: UserAccountService, private teamService:TeamService) { }

  ngOnInit() {
    this.teamService.refreshTeams();
    this.userAccountService.initializeUserAccounts();
  }

  ngOnDestroy() {
  }

  /**
   * Passes on the request to delete a UserAccount to the UserAccountService.
   * @param userAccount UserAccount to be deleted.
   */
  delete(userAccount: UserAccount) {
    this.userAccountService.delete(userAccount);
  }

  /**
   *
   * @param userAccount
   */
  save(userAccount: UserAccount) {
    this.userAccountService.save(userAccount);
  }

  /**
   * Displays a Modal component for adding a new UserAccount.
   */
  openDialog(): void {
    this.dialog.open(AddUserAccountComponent, {
      width: "70vw",
      height: "70vh"
    });
  }
}
