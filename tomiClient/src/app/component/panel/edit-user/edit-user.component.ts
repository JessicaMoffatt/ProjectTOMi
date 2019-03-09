import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {FormControl, Validators, FormGroupDirective, NgForm} from "@angular/forms";
import {UserAccount} from "../../../model/userAccount";
import {TeamService} from "../../../service/team.service";
import {ErrorStateMatcher} from "@angular/material";

/**
 * EditUserComponent is an individual, editable entry for a UserAccount.
 *
 * @author Iliya Kiritchkov
 * @version 1.1
 */
@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent implements OnInit {

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

  /** Validations for the salaried rate. */
  userAccountRateControl = new FormControl('', [
    Validators.required,
    Validators.min(0),
    Validators.pattern(/^[0-9]{1,3}(?:,?[0-9]{3})*\.?[0-9]{0,2}$/)
  ]);

  /** Invalid name error detection. */
  userAccountNameMatcher = new MyErrorStateMatcher();
  /** Invalid email error detection. */
  userAccountEmailMatcher = new MyErrorStateMatcher();
  /** Invalid salaried rate error detection. */
  userAccountRateMatcher = new MyErrorStateMatcher();

  /** The UserAccount model associated with this component. */
  @Input() userAccount: UserAccount;
  /** Event Emitter used to notify the UserAccountComponent parent that the EditUserComponent save had been requested. */
  @Output() saveRequested = new EventEmitter<any>();
  /** Event Emitter used to notify the UserAccountComponent parent that the EditUserComponent delete had been requested. */
  @Output() deleteRequested = new EventEmitter<any>();
  /** Event Emitter used to notify the UserAccountComponent parent that the EditUserComponent cancel had been requested. */
  @Output() cancelRequested = new EventEmitter<any>();

  /** The input field for the UserAccount's first name.*/
  @ViewChild('editUserFirstName') editUserFirstName;

  /** The input field for the UserAccount's last name.*/
  @ViewChild('editUserLastName') editUserLastName;

  /** The input field for the UserAccount's email address.*/
  @ViewChild('editUserEmail') editUserEmail;

  /** The input field for the UserAccount's salaried rate.*/
  @ViewChild('editUserSalariedRate') editUserSalariedRate;

  /** The select field for the UserAccount's team id.*/
  @ViewChild('editUserTeamId') editUserTeamId;

  /** The input checkbox for the UserAccount's Program Director status.*/
  @ViewChild('editUserProgramDirector') editUserProgramDirector;

  /** The input checkbox for the UserAccount's Admin status.*/
  @ViewChild('editUserAdmin') editUserAdmin;

  /** The ngForm for this component */
  @ViewChild('editUserAccountForm') editUserAccountForm;

  constructor(public teamService: TeamService) { }

  /**
   * Initialize the value inputs on the template. This fixes issues caused by the Validators.required when an input is pristine.
   */
  ngOnInit() {
    this.userAccountFirstNameControl.setValue(this.userAccount.firstName);
    this.userAccountLastNameControl.setValue(this.userAccount.lastName);
    this.userAccountEmailControl.setValue(this.userAccount.email);
    this.userAccountRateControl.setValue((this.userAccount.salariedRate/100).toFixed(2));
  }

  /**
   * Emits a request for this UserAccount's changes to be saved.
   */
  save():void {
    if (this.userAccountFirstNameControl.valid && this.userAccountLastNameControl.valid && this.userAccountEmailControl.valid && this.userAccountRateControl.valid) {
        this.userAccount.firstName = this.editUserFirstName.nativeElement.value;
        this.userAccount.lastName = this.editUserLastName.nativeElement.value;
        this.userAccount.email = this.editUserEmail.nativeElement.value;
        this.userAccount.salariedRate = Number (this.editUserSalariedRate.nativeElement.value * 100);
        if (!this.editUserTeamId.empty) {
          this.userAccount.teamId = this.editUserTeamId.selected.value;
        } else {
          this.userAccount.teamId = -1;
        }
        this.userAccount.programDirector = this.editUserProgramDirector.checked;
        this.userAccount.admin = this.editUserAdmin.checked;

        this.saveRequested.emit(this.userAccount);
    }
  }


  /**
   * Emits a request for this UserAccount to be deleted.
   */
  delete():void {
    this.deleteRequested.emit(this.userAccount);
  }

  /**
   * Emits a request for this UserAccount's changes to be cancelled.
   */
  cancel():void {
    this.editUserFirstName.nativeElement.value = this.userAccount.firstName;
    this.editUserLastName.nativeElement.value = this.userAccount.lastName;
    this.editUserEmail.nativeElement.value = this.userAccount.email;
    this.editUserSalariedRate.nativeElement.value = (this.userAccount.salariedRate/100).toFixed(2);
    if (this.userAccount.teamId) {
      this.editUserTeamId.selected.value = this.userAccount.teamId;
    } else {
      this.editUserTeamId.value = null;
    }
    this.editUserAdmin.checked = this.userAccount.admin;
    this.editUserProgramDirector.checked = this.userAccount.programDirector;
    this.cancelRequested.emit(this.userAccount);
  }
}


/** Inner class for error detection of the Angular Material input fields. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || isSubmitted));
  }
}
