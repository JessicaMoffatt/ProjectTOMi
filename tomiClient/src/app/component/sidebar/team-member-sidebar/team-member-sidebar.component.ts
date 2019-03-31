import {AfterViewInit, ViewChild} from '@angular/core';
import {Component, HostListener, Inject, OnInit, Pipe, PipeTransform} from '@angular/core';
import {UserAccount} from "../../../model/userAccount";
import {TimesheetService} from "../../../service/timesheet.service";
import {MatButtonToggleGroup, MatSnackBar} from "@angular/material";
import {TeamService} from "../../../service/team.service";
import {BehaviorSubject} from "rxjs";
import {Team} from "../../../model/team";
import {TeamPanelComponent} from "../../panel/team-panel/team-panel.component";
import {SignInService} from "../../../service/sign-in.service";
import {__await} from "tslib";
import {TeamMemberTimesheetService} from "../../../service/team-member-timesheet.service";
import {ProductivityReportLine} from "../../../model/productivityReportLine";

/**
 * TeamMemberSidebarComponent is used to display the list of team members for a user to interact with when viewing timesheets.
 *
 * @author Jessica Moffatt
 * @version 1.0
 */
@Component({
  selector: 'app-team-member-sidebar',
  templateUrl: './team-member-sidebar.component.html',
  styleUrls: ['./team-member-sidebar.component.scss']
})
export class TeamMemberSidebarComponent implements OnInit, AfterViewInit {
  private teamMembers: BehaviorSubject<Array<UserAccount>> = new BehaviorSubject([]);
  private selectedMember:UserAccount;
  private team:Team;
  @ViewChild("buttonGroup") buttonGroup:MatButtonToggleGroup;

  @HostListener('window:keydown.Control.f', ['$event']) w(e: KeyboardEvent) {
    e.preventDefault();
    document.getElementById("team_member_search").focus();
  }

  constructor(public teamService: TeamService,
              public snackBar: MatSnackBar, private signInService:SignInService,
              @Inject(TeamPanelComponent) private parent: TeamPanelComponent,
              private teamMembersTimesheetService:TeamMemberTimesheetService) {
    this.selectedMember = this.signInService.userAccount;
  }

  //populate the team members, and get their productivity reports: in matching order.
  ngOnInit() {
    this.teamService.getTeamById(this.parent.getTeamId()).forEach(value => {
      this.team = value as Team;
    }).then(() => {
      return this.teamService.getTeamMembers(this.team).forEach((value: UserAccount[]) => {
        this.teamMembers = new BehaviorSubject(value);
      }).then(async ()=>{
        await this.teamMembers.getValue().forEach((member:UserAccount)=>{
          if(member.id === this.signInService.userAccount.id){
            this.selectTeamMember(member);
          }
        });
        return;
      })
    });
  }
  getTeam(){
    return this.team;
  }

  ngAfterViewInit(){

  }

  getTeamMemberList() {
    return this.teamMembers;
  }

  selectTeamMember(member:UserAccount){
    this.selectedMember = member;
    this.parent.setSelectedMember(member);
  }

  // /**
  //  * Displays the latest timesheet for a specified team member.
  //  * @param teamMember The team member whose timesheet is to be displayed.
  //  */
  // displayTimesheet(teamMember: UserAccount) {
  //   this.teamMemberTimesheetService.getMemberById(teamMember.id).subscribe((data: UserAccount) => {
  //     this.teamMemberTimesheetService.selectedMember = data;
  //     this.timesheetService.minDate = null;
  //     this.teamMemberTimesheetService.displayTimesheet();
  //     this.teamMemberTimesheetService.reloadTeamMembers();
  //
  //     this.displayProductivityReport(data);
  //   }, error => {
  //     let errorMessage = 'Something went wrong when displaying the timesheet.';
  //     this.snackBar.open(errorMessage, null, {
  //       duration: 5000,
  //       politeness: 'assertive',
  //       panelClass: 'snackbar-fail',
  //       horizontalPosition: 'right'
  //     });
  //   });
  // }
  //
  // /**
  //  * Displays the productivity report for the given member.
  //  * @param teamMember The team member to display the productivity report for.
  //  */
  // displayProductivityReport(teamMember: UserAccount) {
  //   this.teamMemberTimesheetService.getProductivityReportByMember(teamMember).subscribe((data: ProductivityReportLine[]) => {
  //     this.teamMemberTimesheetService.selectedMemberReport = data;
  //   }, error => {
  //     let errorMessage = 'Something went wrong when loading the productivity report.';
  //     this.snackBar.open(errorMessage, null, {
  //       duration: 5000,
  //       politeness: 'assertive',
  //       panelClass: 'snackbar-fail',
  //       horizontalPosition: 'right'
  //     });
  //   });
  // }
}

@Pipe({name: 'FilterTeamMemberByName'})
export class FilterTeamMemberByName implements PipeTransform {
  transform(teamMemberList: Array<UserAccount>, nameFilter: string): any {
    nameFilter = nameFilter.toLowerCase();
    if (!nameFilter) return teamMemberList;

    return teamMemberList.filter(n => {
      let name  = n.firstName + n.lastName;
      name = name.toLowerCase();

      return name.indexOf(nameFilter) >= 0;
    });
  }
}
