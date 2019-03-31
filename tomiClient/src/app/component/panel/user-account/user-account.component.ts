import {
  Component,
  ElementRef,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  Pipe,
  PipeTransform,
  ViewChild
} from '@angular/core';
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
  private list: Array<UserAccount>;

  @Input() userSelectedEvent: Observable<UserAccount>;

  @ViewChild('editUserComponent') editUserComponent: ElementRef;
  @ViewChild('user_account_search') user_account_search;

  @HostListener('window:keydown.Control.f', ['$event']) w(e: KeyboardEvent) {
    e.preventDefault();
    document.getElementById("user_account_search").focus();
  }

  constructor(private dialog: MatDialog, public userAccountService: UserAccountService, private teamService: TeamService) {
  }

  ngOnInit() {
    this.teamService.initializeTeams();
    this.userAccountService.initializeUserAccounts();
    this.list = this.userAccountService.userSubject.getValue();
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

@Pipe({name: 'FilterUserAccountByName'})
export class FilterUserAccountByName implements PipeTransform {
  transform(userList: Array<UserAccount>, nameFilter: string): any {
    nameFilter = nameFilter.toLowerCase();
    if (!nameFilter) return userList;

    return userList.filter(n => {
      let name = n.firstName + n.lastName;
      name = name.toLowerCase();

      return name.indexOf(nameFilter) >= 0;
    });
  }
}
