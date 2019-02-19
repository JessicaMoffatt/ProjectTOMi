import { Component, OnInit } from '@angular/core';
import {TeamMemberTimesheetService} from "../../../service/team-member-timesheet.service";
import {UserAccount} from "../../../model/userAccount";

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

  displayTimesheet(teamMember: UserAccount){
    this.teamMemberTimesheetService.getMemberById(teamMember.id).subscribe((data:UserAccount) => {
      this.teamMemberTimesheetService.selectedMember = data;

      this.teamMemberTimesheetService.displayTimesheet();
      this.teamMemberTimesheetService.reloadTeamMembers();
    });
  }
}
