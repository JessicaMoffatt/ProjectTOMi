import {Component, OnInit, Pipe, PipeTransform} from '@angular/core';
import {TeamMemberTimesheetService} from "../../../service/team-member-timesheet.service";
import {UserAccount} from "../../../model/userAccount";
import {TimesheetService} from "../../../service/timesheet.service";
import {ProductivityReportLine} from "../../../model/productivityReportLine";
import {MatSnackBar} from "@angular/material";

/**
 * TeamMemberSidebarComponent is used to display the list of team members for a user to interact with when viewing timesheets.
 *
 * @author Jessica Moffatt
 * @author Karol Talbot
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
      this.teamMemberTimesheetService.selectedMemberReport.sort(ProductivityReportLine.compareDate);
      this.teamMemberTimesheetService.selectedMemberReport.sort(ProductivityReportLine.compareUnitType);
      this.teamMemberTimesheetService.setRangeOfProductivityReport(new Date(0), new Date());
    },error =>{
      let errorMessage = 'Something went wrong when loading the productivity report.';
      this.snackBar.open(errorMessage, null, {duration: 5000, politeness: 'assertive', panelClass: 'snackbar-fail', horizontalPosition: 'right'});
    });
  }
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
