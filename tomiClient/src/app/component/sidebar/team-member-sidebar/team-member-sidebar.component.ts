import { Component, OnInit } from '@angular/core';
import {TeamMemberTimesheetService} from "../../../service/team-member-timesheet.service";
import {UserAccount} from "../../../model/userAccount";

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

  constructor(public teamMemberTimesheetService: TeamMemberTimesheetService) { }

  ngOnInit() {
    this.teamMemberTimesheetService.getAllTeamMembers().subscribe((data: Array<UserAccount>) => {
      this.teamMemberTimesheetService.teamMembers = data;
    });
  }

  /**
   * Displays the latest timesheet for a specified team member.
   * @param teamMember The team member whose timesheet is to be displayed.
   */
  displayTimesheet(teamMember: UserAccount){
    this.teamMemberTimesheetService.getMemberById(teamMember.id).subscribe((data:UserAccount) => {
      this.teamMemberTimesheetService.selectedMember = data;
      this.teamMemberTimesheetService.minDate = null;
      this.teamMemberTimesheetService.displayTimesheet();
      this.teamMemberTimesheetService.reloadTeamMembers();
    });
  }
}
