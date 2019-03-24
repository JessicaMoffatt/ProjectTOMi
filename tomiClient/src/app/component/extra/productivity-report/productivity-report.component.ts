import { Component, OnInit } from '@angular/core';
import {TeamMemberTimesheetService} from "../../../service/team-member-timesheet.service";

@Component({
  selector: 'app-productivity-report',
  templateUrl: './productivity-report.component.html',
  styleUrls: ['./productivity-report.component.scss']
})
export class ProductivityReportComponent implements OnInit {
  private displayedColumns: string[] = ['date', 'unitType','quantity','time', 'normalizedValue'];

  constructor(public teamMemberTimesheetService:TeamMemberTimesheetService) { }

  ngOnInit() {

  }

}
