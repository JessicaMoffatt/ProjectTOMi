import {
  Component,
  ComponentFactoryResolver,
  OnInit,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import {Team} from "../../../model/team";
import {TeamSidebarService} from "../../../service/team-sidebar.service";
import {TeamService} from "../../../service/team.service";
import {UserAccount} from "../../../model/userAccount";
import {UserAccountService} from "../../../service/user-account.service";
import {MatDialog, MatDialogRef} from "@angular/material";

@Component({
  selector: 'app-team-sidebar',
  templateUrl: './team-sidebar.component.html',
  styleUrls: ['./team-sidebar.component.scss']
})
export class TeamSidebarComponent implements OnInit {

  constructor(private resolver: ComponentFactoryResolver, private teamSideBarService: TeamSidebarService, private teamService: TeamService,
              public dialog: MatDialog) {
  }

  ngOnInit() {
    this.teamSideBarService.getAllTeams().subscribe((data: Array<Team>) => {
      this.teamSideBarService.teams = data;
    });
  }

  displayTeam(team: Team) {
    this.teamSideBarService.getTeamById(team.id).subscribe((data: Team) => {
      this.teamSideBarService.selectedTeam = data;
    });

    this.teamService.setSelectMembers([]);
    this.teamService.populateTeamMembers(team);
  }

  displayAddTeamModal(): void {
    const dialogRef = this.dialog.open(AddTeamComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
    })
  }

}

/**
 * AddTeamComponent is used to facilitate communication between the view and front end services.
 *
 * @author Jessica Moffatt
 * @version 1.0
 */
@Component({
  selector: 'app-add-team',
  template: `
    <button mat-icon-button [ngClass]="['close_btn']" (click)="closeAddTeamComponent()">
    </button>
    <h1 mat-dialog-title>Add New Team</h1>
    <div mat-dialog-content>
      <mat-form-field>
        <input matInput [(ngModel)]="name" placeholder="Team Name">
      </mat-form-field>

      <mat-form-field>
        <mat-select [(ngModel)]="lead" placeholder="Team Lead">
          <mat-option value="-1">None</mat-option>
          <mat-option *ngFor="let member of (this.teamService.allFreeMembers |orderBy: 'firstName')"
                      [value]="member.id">
            {{member.firstName}} {{member.lastName}}
          </mat-option>
        </mat-select>
      </mat-form-field>

      <div [ngClass]="'modal_btns_container'">
        <button mat-button [ngClass]="['add_btn']" (click)="addTeam()">Add</button>
        <button mat-button [ngClass]="['cancel_btn']" (click)="closeAddTeamComponent()">Cancel</button>
      </div>
    </div>
  `
})
export class AddTeamComponent implements OnInit {

  public name: string;
  public lead: number;

  constructor(private teamSidebarService: TeamSidebarService, public teamService: TeamService,
              private userAccountService: UserAccountService, public dialogRef: MatDialogRef<AddTeamComponent>) {
  }

  /**
   * On initialization of this component, assigns the team service's list of all members.
   */
  ngOnInit() {
    this.teamService.getAllFreeMembers().subscribe((data: Array<UserAccount>) => {
      this.teamService.allFreeMembers = data;
    });
  }

  /**
   * Adds a new team. Passes on the request to save the new team to the team service. If a team lead is selected, also passes
   * on the request to save the user account's info to the user account service.
   */
  addTeam() {
    let team = new Team();
    team.teamName = this.name;

    if (this.lead != undefined) {
      team.leadId = this.lead;
    }

    if(team.teamName != null && team.teamName != ""){
      this.teamService.save(team).then(value => {
        this.teamSidebarService.teams.push(value);

        if (team.leadId != -1) {
          this.teamService.getTeamMemberById(team.leadId).subscribe((data: UserAccount) => {
            let tempAccount = data;
            tempAccount.teamId = value.id;
            this.userAccountService.save(tempAccount).then();
          });
        }

        this.closeAddTeamComponent();
      });
    }else{
      //TODO
      //display error
    }
  }

  /**
   * Closes this add team component.
   */
  closeAddTeamComponent() {
    this.dialogRef.close();
  }
}
