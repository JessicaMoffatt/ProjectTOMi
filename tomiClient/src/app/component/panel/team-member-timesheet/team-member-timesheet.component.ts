import { Component, OnInit } from '@angular/core';
import {TeamMemberTimesheetService} from "../../../service/team-member-timesheet.service";
import {TimesheetService} from "../../../service/timesheet.service";

/**
 * TeamMemberTimesheetComponent is used to facilitate communication between the view and front end services.
 *
 * @author Jessica Moffatt
 * @author Karol Talbot
 * @version 1.0
 */
@Component({
  selector: 'app-team-member-timesheet',
  templateUrl: './team-member-timesheet.component.html',
  styleUrls: ['./team-member-timesheet.component.scss']
})
export class TeamMemberTimesheetComponent implements OnInit {

  constructor(public teamMemberTimesheetService: TeamMemberTimesheetService, public timesheetService:TimesheetService) { }

  ngOnInit() {

  }

  /**
   * Displays the specified timesheet.
   * @param index The index of the timesheet to display.
   */
  displaySpecifiedTimesheet(index:number){
    this.teamMemberTimesheetService.displaySpecifiedTimesheet(index);
  }
}
