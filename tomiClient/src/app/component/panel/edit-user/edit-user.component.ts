import {Component, EventEmitter, Inject, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {FormControl, Validators} from "@angular/forms";
import {UserAccount} from "../../../model/userAccount";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatSelect} from "@angular/material";
import {Observable} from "rxjs";
import {CustomErrorStateMatcher} from "../../extra/CustomErrorStateMatcher";
import {TeamService} from "../../../service/team.service";

/**
 * EditUserComponent is used to facilitate communication between the edit user account view and front end services.
 *
 * @author Iliya Kiritchkov
 * @author Karol Talbot
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

  /** Invalid name error detection. */
  userAccountNameMatcher = new CustomErrorStateMatcher();

  /** Invalid email error detection. */
  userAccountEmailMatcher = new CustomErrorStateMatcher();

  /** The Event emitted indicating that a user has been selected in the sidebar. */
  @Input() userSelectedEvent: Observable<UserAccount>;

  /** The UserAccount model associated with this component. */
  @Input() userAccount: UserAccount;

  /** Event Emitter used to notify the UserAccountComponent parent that the EditUserComponent save had been requested. */
  @Output() saveRequested = new EventEmitter<any>();

  /** Event Emitter used to notify the UserAccountComponent parent that the EditUserComponent delete had been requested. */
  @Output() deleteRequested = new EventEmitter<any>();

  /** Event Emitter used to notify the UserAccountComponent parent that the EditUserComponent cancel had been requested. */
  @Output() cancelRequested = new EventEmitter<any>();

  /** The expansion panel for this user account. */
  @ViewChild('editUserExpansionPanel') editUserExpansionPanel;

  /** The input field for the UserAccount's first name.*/
  @ViewChild('editUserFirstName') editUserFirstName;

  /** The input field for the UserAccount's last name.*/
  @ViewChild('editUserLastName') editUserLastName;

  /** The input field for the UserAccount's email address.*/
  @ViewChild('editUserEmail') editUserEmail;

  /** The input field for the UserAccount's salaried rate.*/
  @ViewChild('editUserSalariedRate') editUserSalariedRate;

  /** The select field for the UserAccount's team id.*/
  @ViewChild('editUserTeamId') editUserTeamId:MatSelect;

  /** The input checkbox for the UserAccount's Program Director status.*/
  @ViewChild('editUserProgramDirector') editUserProgramDirector;

  /** The input checkbox for the UserAccount's Admin status.*/
  @ViewChild('editUserAdmin') editUserAdmin;

  /** The ngForm for this component */
  @ViewChild('editUserAccountForm') editUserAccountForm;

  constructor(public deleteUserDialog: MatDialog, public teamService:TeamService) { }

  ngOnInit() {
  }

  /**
   * Initialize the value inputs on the template. This fixes issues caused by the Validators.required when an input is pristine.
   */
  setValuesOnOpen() {
    this.userAccountFirstNameControl.setValue(this.userAccount.firstName);
    this.userAccountLastNameControl.setValue(this.userAccount.lastName);
    this.userAccountEmailControl.setValue(this.userAccount.email);
    if (this.userAccount.teamId == undefined) {
      this.editUserTeamId.value = null;
    } else {
      this.editUserTeamId.value = this.userAccount.teamId;
    }
    this.editUserAdmin.checked = this.userAccount.admin;
    this.editUserProgramDirector.checked = this.userAccount.programDirector;
  }

  /**
   * Emits a request for this UserAccount's changes to be saved.
   */
  save():void {
    if (this.userAccountFirstNameControl.valid && this.userAccountLastNameControl.valid && this.userAccountEmailControl.valid) {
        this.userAccount.firstName = this.editUserFirstName.nativeElement.value;
        this.userAccount.lastName = this.editUserLastName.nativeElement.value;
        this.userAccount.email = this.editUserEmail.nativeElement.value;
        if (!this.editUserTeamId.empty) {
          this.userAccount.teamId = this.editUserTeamId.value;
        } else {
          this.userAccount.teamId = -1;
        }
        this.userAccount.programDirector = this.editUserProgramDirector.checked;
        this.userAccount.admin = this.editUserAdmin.checked;

        this.editUserExpansionPanel.toggle();
        this.saveRequested.emit(this.userAccount);
    }
  }

  /**
   * Emits a request for this UserAccount to be deleted.
   */
  delete():void {
    this.editUserExpansionPanel.toggle();
    this.deleteRequested.emit(this.userAccount);
  }

  /**
   * Emits a request for this UserAccount's changes to be cancelled.
   */
  cancel():void {
    this.editUserExpansionPanel.toggle();
  }

  /**
   * Displays a Modal component for deleting the selcted UserAccount.
   */
  openDeleteDialog() {
    this.deleteUserDialog.open(DeleteUserAccountModal, {
      width: '40vw',
      data: {userAccountToDelete: this.userAccount, parent: this}
    });
  }
}

// Delete UserAccount Modal

/**
 * DeleteUserAccountModel is used to get confirmation from the user regarding their desire to delete a UserAccount.
 *
 * @author Iliya Kiritchkov
 */
@Component({
  selector: 'app-delete-user-modal',
  templateUrl: './delete-user-modal.html',
  styleUrls: ['./delete-user-modal.scss']
})
export class DeleteUserAccountModal {
  /**
   * The UserAccount to be deleted.
   */
  userAccountToDelete: UserAccount;

  constructor(public dialogRef: MatDialogRef<DeleteUserAccountModal>, @Inject(MAT_DIALOG_DATA) public data: DeleteDialogData) {

  }

  ngOnInit() {
    this.userAccountToDelete = this.data.userAccountToDelete;
  }

  /** Closes the modal with no extra actions.*/
  canceledDelete(): void {
    this.dialogRef.close();
  }

  /** Facilitates the deletion of the selected UserAccount, as well as closes the modal.*/
  confirmedDelete() {
    this.data.parent.delete();
    this.dialogRef.close();
  }
}

/** Data interface for the DeleteUserModal */
export interface DeleteDialogData {
  userAccountToDelete : UserAccount;
  parent: EditUserComponent;
}
