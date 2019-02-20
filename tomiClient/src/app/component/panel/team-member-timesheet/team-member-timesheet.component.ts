import { Component, OnInit } from '@angular/core';
import {TeamMemberTimesheetService} from "../../../service/team-member-timesheet.service";
import {UserAccount} from "../../../model/userAccount";
import {Timesheet} from "../../../model/timesheet";
import {Entry} from "../../../model/entry";
import {TimesheetService} from "../../../service/timesheet.service";

@Component({
  selector: 'app-team-member-timesheet',
  templateUrl: './team-member-timesheet.component.html',
  styleUrls: ['./team-member-timesheet.component.scss']
})
export class TeamMemberTimesheetComponent implements OnInit {

  constructor(public teamMemberTimesheetService: TeamMemberTimesheetService, public timesheetService:TimesheetService) { }

  ngOnInit() {

  }

  displaySpecifiedTimesheet(index:number){
    this.teamMemberTimesheetService.displaySpecifiedTimesheet(index);
  }
}
