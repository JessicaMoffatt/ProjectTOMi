import { Component, OnInit } from '@angular/core';
import {TeamMemberTimesheetService} from "../../../service/team-member-timesheet.service";
import {UserAccount} from "../../../model/userAccount";
import {TimesheetService} from "../../../service/timesheet.service";
import {ProductivityReportLine} from "../../../model/productivityReportLine";
import {MatSnackBar} from "@angular/material";

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
export class TeamMemberSidebarComponent implements OnInit {

  constructor(public teamMemberTimesheetService: TeamMemberTimesheetService,
              public timesheetService:TimesheetService, public snackBar:MatSnackBar) { }

  //populate the team members, and get their productivity reports: in matching order.
  ngOnInit() {
    this.teamMemberTimesheetService.reloadTeamMembers();
  }

  /**
   * Displays the latest timesheet for a specified team member.
   * @param teamMember The team member whose timesheet is to be displayed.
   */
  displayTimesheet(teamMember: UserAccount){
    this.teamMemberTimesheetService.getMemberById(teamMember.id).subscribe((data:UserAccount) => {
      this.teamMemberTimesheetService.selectedMember = data;
      this.timesheetService.minDate = null;
      this.teamMemberTimesheetService.displayTimesheet();
      this.teamMemberTimesheetService.reloadTeamMembers();

      this.displayProductivityReport(data);
    }, error =>{
      let errorMessage = 'Something went wrong when displaying the timesheet.';
      this.snackBar.open(errorMessage, null, {duration: 5000, politeness: 'assertive', panelClass: 'snackbar-fail', horizontalPosition: 'right'});
    });
  }

  /**
   * Displays the productivity report for the given member.
   * @param teamMember The team member to display the productivity report for.
   */
  displayProductivityReport(teamMember: UserAccount){
    this.teamMemberTimesheetService.getProductivityReportByMember(teamMember).subscribe((data:ProductivityReportLine[])=>{
      this.teamMemberTimesheetService.selectedMemberReport = data;
    },error =>{
      let errorMessage = 'Something went wrong when loading the productivity report.';
      this.snackBar.open(errorMessage, null, {duration: 5000, politeness: 'assertive', panelClass: 'snackbar-fail', horizontalPosition: 'right'});
    });
  }
}
