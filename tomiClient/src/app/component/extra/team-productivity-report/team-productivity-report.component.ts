import { Component, OnInit } from '@angular/core';
import {TeamMemberTimesheetService} from "../../../service/team-member-timesheet.service";

@Component({
  selector: 'app-team-productivity-report',
  templateUrl: './team-productivity-report.component.html',
  styleUrls: ['./team-productivity-report.component.scss']
})
export class TeamProductivityReportComponent implements OnInit {
  displayedColumns: string[] = ['date', 'teamMember', 'unitType','quantity','time', 'normalizedValue'];

  constructor(public teamMemberTimesheetService:TeamMemberTimesheetService) { }

  ngOnInit() {
  }

}
