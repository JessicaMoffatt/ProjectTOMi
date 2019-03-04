import {Component, EventEmitter, Input, NgModule, OnInit, Output, ViewChild} from '@angular/core';
import {UserAccount} from "../../../model/userAccount";
import {TeamService} from "../../../service/team.service";

/**
 * ViewUserComponent is an individual read-only entry for a UserAccount.
 *
 * @author Iliya Kiritchkov
 * @version 1.0
 */
@NgModule({
  providers: [TeamService]
})
@Component({
  selector: 'app-view-user',
  templateUrl: './view-user.component.html',
  styleUrls: ['./view-user.component.scss']
})
export class ViewUserComponent implements OnInit {

  /** The UserAccount model associated with this component. */
  @Input() userAccount: UserAccount;
  /** Event Emitter used to notify the UserAccountComponent parent that the ViewUserComponent edit had been requested. */
  @Output() editRequested = new EventEmitter<any>();
  /** Event Emitter used to notify the UserAccountComponent parent that the ViewUserComponent delete had been requested. */
  @Output() deleteRequested = new EventEmitter<any>();

  constructor(public teamService: TeamService) { }

  ngOnInit() {

  }

  /**
   * Emits a request for this UserAccount's changes to be saved.
   */
  edit():void {
    this.editRequested.emit(this.userAccount);
  }

  /**
   * Emits a request for this UserAccount to be deleted.
   */
  delete():void {
    this.deleteRequested.emit(this.userAccount);
  }
}
