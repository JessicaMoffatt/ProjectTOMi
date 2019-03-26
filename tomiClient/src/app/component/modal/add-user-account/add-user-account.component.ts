import {Component, OnInit, ViewChild} from '@angular/core';
import {UserAccountService} from "../../../service/user-account.service";
import {UserAccount} from "../../../model/userAccount";
import {TeamService} from "../../../service/team.service";
import {FormControl, FormGroupDirective, NgForm, Validators} from "@angular/forms";
import {ErrorStateMatcher, MatDialogRef} from "@angular/material";

/**
 * AddTaskComponent is a modal form used to add a new UserAccount to the database.
 *
 * @author Iliya Kiritchkov
 * @author Karol Talbot
 * @version 1.1
 */
@Component({
  selector: 'app-add-user-account',
  templateUrl: './add-user-account.component.html',
  styleUrls: ['./add-user-account.component.scss']
})
export class AddUserAccountComponent implements OnInit {

  /** Validations for the first name. */
  userAccountFirstNameControl = new FormControl('', [
    Validators.required,
    Validators.pattern(/^[a-zA-Z ]{1,255}$/)
  ]);

  /** Validations for the last name. */
  userAccountLastNameControl = new FormControl('', [
    Validators.required,
    Validators.pattern(/^[a-zA-Z ]{1,255}$/)
  ]);

  /** Validations for the email address. */
  userAccountEmailControl = new FormControl('', [
    Validators.required,
    Validators.email
  ]);

  /** Invalid name error detection. */
  userAccountNameMatcher = new MyErrorStateMatcher();
  /** Invalid email error detection. */
  userAccountEmailMatcher = new MyErrorStateMatcher();

  /** The input field for the UserAccount's first name. */
  @ViewChild('addUserFirstName') addUserAccountFirstName;

  /** The input field for the UserAccount's last name. */
  @ViewChild('addUserLastName') addUserAccountLastName;

  /** The input field for the UserAccount's email address. */
  @ViewChild('addUserEmail') addUserAccountEmail;

  /** The input field for the UserAccount's salaried rate. */
  @ViewChild('addUserSalariedRate') addUserAccountSalariedRate;

  /** The input field for the UserAccount's team. */
  @ViewChild('addUserTeamId') addUserAccountTeamId;

  /** The input field for the UserAccount's Program Director status. */
  @ViewChild('addUserProgramDirector') addUserAccountProgramDirector;

  /** The input field for the UserAccount's admin status. */
  @ViewChild('addUserAdmin') addUserAccountAdmin;

  /** The ngForm for this component */
  @ViewChild('addUserForm') addUserAccountForm;

  constructor(public dialogRef: MatDialogRef<AddUserAccountComponent>,
              private userAccountService: UserAccountService,
              private teamService: TeamService) { }

  /**
   * Closes the modal component.
    */
  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit() {

  }

  /**
   * Adds a new UserAccount. Passes the request to save the new UserAccount to the UserAccountService.
   */
  addUserAccount() {
    if (this.userAccountFirstNameControl.valid && this.userAccountLastNameControl.valid && this.userAccountEmailControl.valid) {
      let userAccountToAdd = new UserAccount();
      userAccountToAdd.firstName = this.addUserAccountFirstName.nativeElement.value;
      userAccountToAdd.lastName = this.addUserAccountLastName.nativeElement.value;
      userAccountToAdd.email = this.addUserAccountEmail.nativeElement.value;

      if (this.addUserAccountTeamId.selected) {
        userAccountToAdd.teamId = this.addUserAccountTeamId.selected.value;
      } else {
        userAccountToAdd.teamId = -1;
      }

      userAccountToAdd.programDirector = this.addUserAccountProgramDirector.checked;
      userAccountToAdd.admin = this.addUserAccountAdmin.checked;

      this.userAccountService.save(userAccountToAdd);
      this.dialogRef.close();
    }
  }
}

/** Inner class for error detection of the Angular Material input fields. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || isSubmitted));
  }
}
