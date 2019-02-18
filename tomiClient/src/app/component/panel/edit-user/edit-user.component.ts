import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {UserAccount} from "../../../model/userAccount";
import {TeamService} from "../../../service/team.service";

/**
 * EditUserComponent is an individual, editable entry for a UserAccount.
 *
 * @author Iliya Kiritchkov
 * @version 1.0
 */
@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent implements OnInit {

  /** The UserAccount model associated with this component. */
  @Input() userAccount: UserAccount;
  /** Event Emitter used to notify the UserAccountComponent parent that the EditUserComponent save had been requested. */
  @Output() saveRequested = new EventEmitter<any>();
  /** Event Emitter used to notify the UserAccountComponent parent that the EditUserComponent cancel had been requested. */
  @Output() cancelRequested = new EventEmitter<any>();

  /** The input field for the UserAccount's first name.*/
  @ViewChild('editUserFirstName') editUserFirstName;

  /** The input field for the UserAccount's last name.*/
  @ViewChild('editUserFirstName') editUserLastName;

  constructor(public teamService: TeamService) { }

  ngOnInit() {

  }

  /**
   * Emits a request for this UserAccount's changes to be saved.
   */
  save():void {
    this.userAccount.firstName = this.editUserFirstName.nativeElement.value;
    this.userAccount.lastName = this.editUserLastName.nativeElement.value;
    this.userAccount.email = (<HTMLInputElement>document.getElementById("edit_user_account_email")).value;
    this.userAccount.salariedRate = Number((<HTMLInputElement>document.getElementById("edit_user_account_salary")).value);
    this.userAccount.teamId = Number((<HTMLInputElement>document.getElementById("edit_user_account_team")).value);
    this.saveRequested.emit(this.userAccount);

    let goodUserAccount = true;
    let nameRegex = /^[a-zA-Z ]{1,255}$/;

    // Validate the first and last names
    if (!nameRegex.test(this.userAccount.firstName) || !nameRegex.test(this.userAccount.lastName)) {
      goodUserAccount = false;
    } else {
      // Capitalize the first character of the first and last name are capitalized
      this.userAccount.firstName = this.userAccount.firstName.charAt(0).toUpperCase() + this.userAccount.firstName.substring(1);
      this.userAccount.lastName = this.userAccount.lastName.charAt(0).toUpperCase() + this.userAccount.lastName.substring(1);
    }

    // Validate length of email address
    if (!(this.userAccount.email.length > 1)) {
      goodUserAccount = false;
    }

    // Validate salaried rate
    // If valid, multiply by 100 to change from pennies to dollars.
    if (!(this.userAccount.salariedRate > 0)) {
      goodUserAccount = false;
    } else {
      this.userAccount.salariedRate *= 100;
    }

    // Save the new UserAccount if it has been fully validated.
    if (goodUserAccount) {
      this.saveRequested.emit(this.userAccount);
    }

  }

  /**
   * Emits a request for this UserAccount's changes to be cancelled.
   */
  cancel():void {
    this.cancelRequested.emit(this.userAccount);
  }

}
