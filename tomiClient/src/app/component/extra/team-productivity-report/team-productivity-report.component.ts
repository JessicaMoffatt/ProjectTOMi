import {Component, OnDestroy, OnInit} from '@angular/core';
import {TeamMemberTimesheetService} from "../../../service/team-member-timesheet.service";

@Component({
  selector: 'app-team-productivity-report',
  templateUrl: './team-productivity-report.component.html',
  styleUrls: ['./team-productivity-report.component.scss']
})
export class TeamProductivityReportComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ['date', 'teamMember', 'unitType','quantity','time', 'normalizedValue'];

  constructor(public teamMemberTimesheetService:TeamMemberTimesheetService) { }

  ngOnInit() {
  }

  ngOnDestroy(){
    this.teamMemberTimesheetService.teamMembersReports =[];
  }
}
