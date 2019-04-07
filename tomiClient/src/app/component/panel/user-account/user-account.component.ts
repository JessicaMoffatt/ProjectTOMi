import {
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
  Pipe,
  PipeTransform,
  ViewChild
} from '@angular/core';
import {UserAccountService} from "../../../service/user-account.service";
import {UserAccount} from "../../../model/userAccount";
import {AddUserAccountComponent} from "../../modal/add-user-account/add-user-account.component";
import {MatDialog} from "@angular/material";
import {TeamService} from "../../../service/team.service";

/**
 * UserAccountComponent is used to facilitate communication between the manage user accounts view and front end services.
 * @author Karol Talbot
 * @author Iliya Kiritchkov
 */
@Component({
  selector: 'app-user-account',
  templateUrl: './user-account.component.html',
  styleUrls: ['./user-account.component.scss']
})
export class UserAccountComponent implements OnInit {

  /**
   * The UserAccount being viewed.
   */
  private userAccount: UserAccount;

  /**
   * The edit user component within this user account component.
   */
  @ViewChild('editUserComponent') editUserComponent: ElementRef;
  /**
   * The user account search bar within this uer account component.
   */
  @ViewChild('user_account_search') user_account_search;

  /**
   * Listens for the Ctrl+f key's keydown event; Moves focus to the search bar on that event.
   * @param e The event captured.
   */
  @HostListener('window:keydown.Control.f', ['$event']) w(e: KeyboardEvent) {
    e.preventDefault();
    document.getElementById("user_account_search").focus();
  }

  constructor(private dialog: MatDialog, public userAccountService: UserAccountService, private teamService: TeamService) {
  }

  ngOnInit() {
    this.teamService.initializeTeams();
    this.userAccountService.initializeUserAccounts();
  }

  /**
   * Passes on the request to delete a UserAccount to the UserAccountService.
   * @param userAccount UserAccount to be deleted.
   */
  delete(userAccount: UserAccount) {
    this.userAccountService.delete(userAccount);
  }

  /**
   * Passes on the request to save a UserAccount to the UserAccountService.
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
      width: "70vw"
    });
  }

}

/**
 * Pipe used to filter UserAccounts by their name.
 */
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
