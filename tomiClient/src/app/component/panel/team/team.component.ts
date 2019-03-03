import {AfterViewInit, Component, ComponentFactoryResolver, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {TeamService} from "../../../service/team.service";
import {Team} from "../../../model/team";
import {UserAccount} from "../../../model/userAccount";
import {TeamSidebarService} from "../../../service/team-sidebar.service";
import {MatDialog, MatDialogRef, MatSelectionList, MatSelectionListChange} from "@angular/material";
import {UserAccountService} from "../../../service/user-account.service";

/**
 * TeamComponent is used to facilitate communication between the view and front end services.
 *
 * @author Jessica Moffatt
 * @version 2.0
 */
@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.scss']
})
export class TeamComponent implements OnInit {

  @ViewChild('teamMemberList') teamMemberList: MatSelectionList;

  constructor(public teamService: TeamService,
              public teamSideBarService: TeamSidebarService,public dialog: MatDialog) {
  }

  ngOnInit() {
  }

  /**
   * Sets the selected team members.
   * @param event The event to be captured.
   * @param selectedMembers The selected values.
   */
  onSelection(event, selectedMembers) {
    let tempList: UserAccount[] = [];
    for(let m of selectedMembers) {
      tempList.push(m.value);
    }
    this.teamService.setSelectMembers(tempList);
  }

  /**
   * Removes the selected member from the team.
   */
  removeMembers() {
    this.teamService.removeMembers().then();
  }

  /**
   * Dynamically creates the add team member component, which will be housed in the template with the id of 'add_team_member_container'.
   */
  displayAddMemberModal():void {
    const dialogRef = this.dialog.open(AddTeamMemberComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
    })
  }

  /**
   * Passes on the request to save a given team to the team service.
   *
   * @param team The team to be saved.
   */
  save(team: Team) {
    if(team.id == undefined){
      team.leadId = -1;
    }

    console.log(team);
    this.teamService.save(team).then();
  }

  /**
   * Passes on the request to delete a given team to the team service.
   * @param team The team to be deleted.
   */
  delete(team: Team) {
    this.teamService.delete(team);
  }

  /**
   * Passes on the request to cancel changes made to the given team to the team service.
   * @param team The teams whose changes are to be canceled.
   */
  cancel(team: Team): void {
    this.teamService.cancel(team);
  }
}

/**
 * AddTeamMemberComponent is used to facilitate communication between the view and front end services.
 *
 * @author Jessica Moffatt
 * @version 1.0
 */
@Component({
  selector: 'app-add-team-member',
  template: `    
      <button mat-icon-button [ngClass]="['close_btn']" (click)="closeAddMemberComponent()"></button>
      <h1 mat-dialog-title>Add Member To Team</h1>
      <div  mat-dialog-content>

        <mat-form-field>
          <mat-select [(ngModel)]="member" placeholder="New Member">
            <mat-option *ngFor="let member of (this.teamService.allFreeMembers  |orderBy: 'firstName')"
                        [value]="member.id">
              {{member.firstName}} {{member.lastName}}
            </mat-option>
          </mat-select>
        </mat-form-field>
        
            <div [ngClass]="'modal_btns_container'">
              <button mat-button [ngClass]="['btn','add_btn']" (click)="addMember()">Add</button>
              <button mat-button [ngClass]="['btn','cancel_btn']" (click)="closeAddMemberComponent()">
                Cancel
              </button>
            </div>
      </div>
  `
})
export class AddTeamMemberComponent implements OnInit {

  member:number;

  constructor(public teamService: TeamService, private teamSidebarService: TeamSidebarService,
              private userAccountService: UserAccountService, public dialogRef: MatDialogRef<AddTeamMemberComponent>) {
  }

  /**
   * On initialization of this component, assigns the team service's list of all members.
   */
  ngOnInit() {
    this.teamService.getAllFreeMembers().subscribe((data: Array<UserAccount>) => {
      this.teamService.allFreeMembers = data;
    });
  }

  //TODO add error handling
  /**
   * Adds the selected team member to the team. Passes on requests to save this information to the user account service and team service.
   */
  addMember(): void {
    let memberId = this.member;

    if(memberId != null && memberId != undefined){
      let toAdd: UserAccount = new UserAccount();

      this.teamService.getTeamMemberById(memberId).subscribe((data: UserAccount) => {
        toAdd = data;
        toAdd.teamId = this.teamSidebarService.selectedTeam.id;

        this.userAccountService.save(toAdd).then(()=>{
          this.teamService.teamMembers.push(toAdd);

          let index = this.teamService.allFreeMembers.findIndex((element) => {
            return (element.id == toAdd.id);
          });

          this.teamService.allFreeMembers.splice(index, 1);
          this.member = null;
        });
      });
    }
  }

  /**
   * Closes the add member component.
   */
  closeAddMemberComponent(): void {
    this.dialogRef.close();
  }
}
