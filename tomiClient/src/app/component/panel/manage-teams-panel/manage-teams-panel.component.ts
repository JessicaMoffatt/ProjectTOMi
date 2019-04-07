import {Component, HostListener, Inject, Input, OnInit, Pipe, PipeTransform, ViewChild} from '@angular/core';
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
  /**
   * The number of Teams to be displayed per page.
   */
  PAGE_SIZE: number = 6;

  /**
   * The selected Team.
   */
  private selectedTeam: Team = null;

  /**
   * The team members for the selected Team.
   */
  private selectedTeamMembers: BehaviorSubject<Array<UserAccount>> = new BehaviorSubject([]);

  /**
   * The UserAccounts that are available to be added as members of this Team.
   */
  private availableMembers: BehaviorSubject<Array<UserAccount>> = new BehaviorSubject([]);

  /**
   * The currently viewed page number for this Team's team members..
   */
  private teamMembersPageNumber: number = 0;

  /**
   * The list of this Team's team members currently being displayed on this page.
   */
  private teamMembersPage: Array<UserAccount> = [];

  /**
   * The currently viewed page number for the available members.
   */
  private availableMembersPageNumber: number = 0;

  /**
   * The list of available members currently being displayed on this page.
   */
  private availableMembersPage: Array<UserAccount> = [];

  /**
   * The buffer of users that need to be written out on save.
   */
  private dirtyUserBuffer: Array<UserAccount> = [];

  /** Validations for the name of this Team. */
  teamNameControl = new FormControl('', [
    Validators.required
  ]);

  /** Invalid name error detection. */
  teamNameMatcher = new CustomErrorStateMatcher();

  /** The input field for this Team's name.*/
  @ViewChild('editTeamName') editTeamName: MatInput;

  /** The selector for this Team's team lead.*/
  @ViewChild('editTeamLeadId') editTeamLeadId: MatSelect;

  /**
   * The team sidebar component within this manage teams panel component.
   */
  @ViewChild('sideBar') sideBar;

  /**
   * The paginator used to navigate the pages of this Team's team members.
   */
  @ViewChild('memberPaginator') memberPaginator: MatPaginator;

  /**
   * The paginator used to navigate the pages of the available members.
   */
  @ViewChild('availablePaginator') availablePaginator: MatPaginator;

  /**
   * Listens for the enter key's keyup event; performs the save function on that event.
   * @param e The event captured.
   */
  @HostListener('window:keyup.Enter', ['$event']) enter(e: KeyboardEvent) {
    this.save().then();
  }

  /**
   * The filter bar for filtering the Team's displayed team members.
   */
  @ViewChild('member_filter') member_filter;

  /**
   * The filter bar for filtering the available members displayed.
   */
  @ViewChild('available_filter') available_filter;

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

  /**
   * Returns true if selectedTeam is not null, otherwise false.
   */
  public isTeamSelected(): boolean {
    return this.selectedTeam != null;
  }

  /**
   * Sets selectedTeam to the specified Team.
   * @param team The Team to set selectedTeam to.
   */
  public setSelectedTeam(team: Team): void {
    this.selectedTeam = team;
    this.setValuesOnOpen();
    this.getTeamMembers();
  }

  /**
   * Returns selectedTeam.
   */
  public getSelectedTeam(): Team {
    return this.selectedTeam;
  }

  /**
   * Displays a Modal component for adding a new Team.
   */
  openDialog(): void {
    this.dialog.open(AddTeamComponent, {
      width: "70vw"
    });
  }

  /**
   * Populates the selectedTeamMembers list and the availableMembers list.
   */
  public getTeamMembers() {
    this.teamService.getTeamMembers(this.selectedTeam).forEach(userAccount => {
      this.selectedTeamMembers = new BehaviorSubject<Array<UserAccount>>(userAccount);
      this.userAccountService.sortUserAccounts(this.selectedTeamMembers);
      this.setTeamMembersPage();
    }).catch((error: any) => {

    });
    this.teamService.getAllFreeMembers().forEach(userAccount => {
      this.availableMembers = new BehaviorSubject<Array<UserAccount>>(userAccount);
      this.userAccountService.sortUserAccounts(this.availableMembers);
      this.setAvailableMembersPage();
    }).catch((error: any) => {

    });
  }

  /**
   * Returns selectedTeamMembers.
   */
  public getSelectedTeamMembers() {
    return this.selectedTeamMembers;
  }

  /**
   * Returns availableMembers.
   */
  public getAvailableMembers() {
    return this.availableMembers;
  }

  /**
   * Drag and drop function used to either add or remove members (retrieved from the event)
   * to the team member list or the available members list.
   * @param event The object dropped as an event.
   * @param list The list the event is being dropped into.
   */
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

  /**
   * Clears the user buffer and deselects the selected Team.
   */
  public cancel() {
    this.dirtyUserBuffer = [];
    this.sideBar.unselect(this.selectedTeam.id);
    this.selectedTeam = null;
  }

  /**
   * Removes the specified UserAccount from the Team.
   * @param member The UserAccount to be removed.
   */
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

  /**
   * Adds the specified UserAccount to the Team.
   * @param member The UserAccount to be added.
   */
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

  /**
   * Moves the specified team member to the opposite list.
   * If the UserAccount was in selectedTeamMembers, moves them to availableMembers; and visa versa.
   * @param member
   * @param list
   */
  public move(member: UserAccount, list: string) {
    if ("available" != list) {
      this.remove(member);
    } else {
      this.addUserAccount(member);
    }
  }

  /**
   * Sets the members to be displayed in the team members page.
   */
  public setTeamMembersPage() {
    this.teamMembersPage = this.selectedTeamMembers.getValue();
  }

  /**
   * Gets the team members to be displayed on the team members page.
   */
  public getTeamMembersPage() {
    let filter = new FilterTeamUserAccountByName();
    let filterList = this.teamMembersPage;

    if(this.member_filter != undefined){
      filterList = filter.transform(this.teamMembersPage, this.member_filter.nativeElement.value);
    }
    return filterList.slice(this.teamMembersPageNumber * this.PAGE_SIZE, this.teamMembersPageNumber * this.PAGE_SIZE + this.PAGE_SIZE);
  }

  /**
   * Sets the members to be displayed in the available members page.
   */
  public setAvailableMembersPage() {
    this.availableMembersPage = this.availableMembers.getValue();
  }

  /**
   * Gets the team members to be displayed on the available members page.
   */
  public getAvailableMembersPage() {
    let filter = new FilterTeamUserAccountByName();
    let filterList = this.availableMembersPage;

    if(this.available_filter != undefined){
      filterList = filter.transform(this.availableMembersPage, this.available_filter.nativeElement.value);
    }
    return filterList.slice(this.availableMembersPageNumber * this.PAGE_SIZE, this.availableMembersPageNumber * this.PAGE_SIZE + this.PAGE_SIZE);
  }

  /**
   * Changes the team members page number to the specified index.
   * @param event The page event containing the page index.
   */
  public teamPageChange(event: PageEvent) {
    this.teamMembersPageNumber = event.pageIndex;
  }

  /**
   * Changes the available members page number to the specified index.
   * @param event The page event containing the page index.
   */
  public availablePageChange(event: PageEvent) {
    this.availableMembersPageNumber = event.pageIndex;
  }

  /**
   * Passes on the request to save changes to the selected Team to the UserAccountService (for team member changes) and
   * the TeamService.
   */
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
      this.dirtyUserBuffer = [];
    }
  }

  /**
   * Passes on the request to delete the selected Team to the TeamService.
   */
  public async delete() {
    this.dirtyUserBuffer= [];
    await this.teamService.delete(this.selectedTeam);
    this.sideBar.unselect(this.selectedTeam.id);
    this.teamService.initializeTeams();
    this.selectedTeam = null;
  }

  /**
   * Displays a Modal component for deleing the selected Team.
   */
  openDeleteDialog() {
    this.deleteTeamDialog.open(DeleteTeamModal, {
      width: '40vw',
      data: {teamToDelete: this.selectedTeam, parent: this}
    });
  }
}

// Delete Modal

/**
 * DeleteTeamModal is used to get confirmation from the user regarding their desire to delete a team.
 */
@Component({
  selector: 'app-delete-team-modal',
  templateUrl: './delete-team-modal.html',
  styleUrls: ['./delete-team-modal.scss']
})
export class DeleteTeamModal {
  /**
   * The team to be deleted.
   */
  teamToDelete: Team;

  constructor(public dialogRef: MatDialogRef<DeleteTeamModal>,
              @Inject(MAT_DIALOG_DATA) public data: DeleteDialogData) {

  }

  ngOnInit() {
    this.teamToDelete = this.data.teamToDelete;
  }

  /** Closes the modal with no extra actions.*/
  canceledDelete(): void {
    this.dialogRef.close();
  }

  /** Facilitates deletion of the selected Team.**/
  confirmedDelete() {
    this.data.parent.delete();
    this.dialogRef.close();
  }
}

/** Data interface for the DeleteTeamModal */
export interface DeleteDialogData {
  teamToDelete: Team;
  parent: ManageTeamsPanelComponent;
}

/**
 * Class used to filter the user accounts of either the team members list or the available members list.
 */
export class FilterTeamUserAccountByName {
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
