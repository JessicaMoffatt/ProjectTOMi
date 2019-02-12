import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
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

  constructor(public teamService: TeamService) { }

  ngOnInit() {

  }

  /**
   * Emits a request for this UserAccount's changes to be saved.
   */
  save():void {
    this.saveRequested.emit(this.userAccount);
  }

  /**
   * Emits a request for this UserAccount's changes to be cancelled.
   */
  cancel():void {
    this.cancelRequested.emit(this.userAccount);
  }

}
