import {Component, HostListener, Inject, OnInit, Pipe, PipeTransform, ViewChild} from '@angular/core';
import {Team} from "../../../model/team";
import {FormControl, Validators} from "@angular/forms";
import {TeamService} from "../../../service/team.service";
import {UserAccountService} from "../../../service/user-account.service";
import {UserAccount} from "../../../model/userAccount";
import {BehaviorSubject} from "rxjs";
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
  MatInput,
  MatPaginator,
  MatSelect,
  PageEvent
} from "@angular/material";
import {AddTeamComponent} from "../../modal/add-team/add-team.component";
import {CustomErrorStateMatcher} from "../../extra/CustomErrorStateMatcher";

/**
 * @author Karol Talbot
 * @version 2.0
 */
@Component({
  selector: 'app-manage-teams-panel',
  templateUrl: './manage-teams-panel.component.html',
  styleUrls: ['./manage-teams-panel.component.scss']
})
export class ManageTeamsPanelComponent implements OnInit {
  PAGE_SIZE: number = 8;
  private selectedTeam: Team = null;
  private selectedTeamMembers: BehaviorSubject<Array<UserAccount>> = new BehaviorSubject([]);
  private availableMembers: BehaviorSubject<Array<UserAccount>> = new BehaviorSubject([]);
  private teamMembersPageNumber: number = 0;
  private teamMembersPage: Array<UserAccount> = [];
  private availableMembersPageNumber: number = 0;
  private availableMembersPage: Array<UserAccount> = [];
  private dirtyUserBuffer: Array<UserAccount> = [];

  /** Validations for the name. */
  teamNameControl = new FormControl('', [
    Validators.required
  ]);

  /** Invalid name error detection. */
  teamNameMatcher = new CustomErrorStateMatcher();

  /** The input field for the Team's name.*/
  @ViewChild('editTeamName') editTeamName: MatInput;
  @ViewChild('editTeamLeadId') editTeamLeadId: MatSelect;

  @ViewChild('sideBar') sideBar;
  @ViewChild('memberPaginator') memberPaginator: MatPaginator;
  @ViewChild('availablePaginator') availablePaginator: MatPaginator;

  @HostListener('window:keyup.Enter', ['$event']) enter(e: KeyboardEvent) {
    this.save().then();
  }

  constructor(private dialog: MatDialog, public deleteTeamDialog: MatDialog, private teamService: TeamService, public userAccountService: UserAccountService) {
  }

  ngOnInit() {
  }


  /**
   * Initialize the value inputs on the template. This fixes issues caused by the Validators.required when an input is pristine.
   */
  setValuesOnOpen() {
    this.teamNameControl.setValue(this.selectedTeam.teamName);
  }

  public isTeamSelected(): boolean {
    return this.selectedTeam != null;
  }

  public setSelectedTeam(team: Team): void {
    console.log(team);
    this.selectedTeam = team;
    this.setValuesOnOpen();
    this.getTeamMembers();
  }

  public getSelectedTeam(): Team {
    return this.selectedTeam;
  }

  /**
   * Displays a Modal component for adding a new Team.
   */
  openDialog(): void {
    this.dialog.open(AddTeamComponent, {
      width: "70vw",
      height: "70vh"
    });
  }

  public getTeamMembers() {
    this.teamService.getTeamMembers(this.selectedTeam).forEach(userAccount => {
      this.selectedTeamMembers = new BehaviorSubject<Array<UserAccount>>(userAccount);
      this.setTeamMembersPage();
    }).catch((error: any) => {
      console.log("Team Member error " + error);
    });
    this.teamService.getAllFreeMembers().forEach(userAccount => {
      this.availableMembers = new BehaviorSubject<Array<UserAccount>>(userAccount);
      this.setAvailableMembersPage();
    }).catch((error: any) => {
      console.log("Team Member error " + error);
    });
  }

  public getSelectedTeamMembers() {
    return this.selectedTeamMembers;
  }

  public getAvailableMembers() {
    return this.availableMembers;
  }

  public drop(event: Event, list: String) {
    let member = event['item'].data as UserAccount;
    if (event['container'] != event['previousContainer']) {
      if ("available" == list) {
        this.remove(member);
      } else {
        this.addUserAccount(member);
      }
    }
  }

  public cancel() {
    this.sideBar.unselect(this.selectedTeam.id);
    this.selectedTeam = null;
  }

  private remove(member: UserAccount) {
    let index: number;
    let arrayLocation = this.selectedTeamMembers.getValue().lastIndexOf(member);
    this.selectedTeamMembers.getValue().splice(arrayLocation, 1);
    this.availableMembers.getValue().push(member);
    index = this.dirtyUserBuffer.lastIndexOf(member);
    member.teamId = -1;
    if (-1 == index) {
      this.dirtyUserBuffer.push(member);
    } else {
      this.dirtyUserBuffer.splice(index, 1);
    }
  }

  private addUserAccount(member: UserAccount) {
    let index: number;
    let arrayLocation = this.availableMembers.getValue().lastIndexOf(member);
    this.availableMembers.getValue().splice(arrayLocation, 1);
    this.selectedTeamMembers.getValue().push(member);
    index = this.dirtyUserBuffer.lastIndexOf(member);
    member.teamId = this.selectedTeam.id;
    if (-1 == index) {
      this.dirtyUserBuffer.push(member);
    } else {
      this.dirtyUserBuffer.splice(index, 1);
    }
  }

  public move(member: UserAccount, list: string) {
    if ("available" != list) {
      this.remove(member);
    } else {
      this.addUserAccount(member);
    }
  }

  public setTeamMembersPage() {
    this.teamMembersPage = this.selectedTeamMembers.getValue();
  }

  public getTeamMembersPage() {
    return this.teamMembersPage.slice(this.teamMembersPageNumber * this.PAGE_SIZE, this.teamMembersPageNumber * this.PAGE_SIZE + this.PAGE_SIZE);
  }

  public setAvailableMembersPage() {
    this.availableMembersPage = this.availableMembers.getValue();
  }

  public getAvailableMembersPage() {
    return this.availableMembersPage.slice(this.availableMembersPageNumber * this.PAGE_SIZE, this.availableMembersPageNumber * this.PAGE_SIZE + this.PAGE_SIZE);
  }


  public teamPageChange(event: PageEvent) {
    this.teamMembersPageNumber = event.pageIndex;
  }

  public availablePageChange(event: PageEvent) {
    this.availableMembersPageNumber = event.pageIndex;
  }

  public async save() {
    if (this.teamNameControl.valid) {
      this.selectedTeam.teamName = this.teamNameControl.value;
      if (undefined != this.editTeamLeadId.value) {
        this.selectedTeam.leadId = this.editTeamLeadId.value;
      } else {
        this.selectedTeam.leadId = -1;
      }

      this.dirtyUserBuffer.forEach(async (user: UserAccount) => {
        await this.userAccountService.save(user);
      });
      await this.teamService.save(this.selectedTeam);
      this.sideBar.unselect(this.selectedTeam.id);
      this.selectedTeam = null;
    }
  }

  public async delete() {
    await this.teamService.delete(this.selectedTeam);
    this.sideBar.unselect(this.selectedTeam.id);
    this.teamService.initializeTeams();
    this.selectedTeam = null;
  }

  openDeleteDialog() {
    this.deleteTeamDialog.open(DeleteTeamModal, {
      width: '40vw',
      data: {teamToDelete: this.selectedTeam, parent: this}
    });
  }
}

@Component({
  selector: 'app-delete-team-modal',
  templateUrl: './delete-team-modal.html',
  styleUrls: ['./delete-team-modal.scss']
})
/** Inner class for confirmation modal of delete Team. */
export class DeleteTeamModal {
  teamToDelete: Team;

  constructor(public dialogRef: MatDialogRef<DeleteTeamModal>, @Inject(MAT_DIALOG_DATA) public data: DeleteDialogData) {

  }

  ngOnInit() {
    this.teamToDelete = this.data.teamToDelete;
  }

  canceledDelete(): void {
    this.dialogRef.close();
  }

  confirmedDelete() {
    this.data.parent.delete();
    this.dialogRef.close();
  }
}

/** Data interface for the DeleteUserModal */
export interface DeleteDialogData {
  teamToDelete : Team;
  parent: ManageTeamsPanelComponent;
}
