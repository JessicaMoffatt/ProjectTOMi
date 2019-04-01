import {Component, OnInit, ViewChild} from '@angular/core';
import {SignInService} from "../../../service/sign-in.service";
import {UserAccount} from "../../../model/userAccount";
import {TeamMemberTimesheetService} from "../../../service/team-member-timesheet.service";
import {ProductivityReportLine} from "../../../model/productivityReportLine";
import {BehaviorSubject} from "rxjs";

@Component({
  selector: 'app-team-panel',
  templateUrl: './team-panel.component.html',
  styleUrls: ['./team-panel.component.scss']
})
export class TeamPanelComponent implements OnInit {
  constructor(private signInService:SignInService, private teamMemberTimesheetService:TeamMemberTimesheetService) { }
  @ViewChild("individualReport")individualReport;
  @ViewChild("sideBar")sideBar;
  @ViewChild("teamReport")teamReport;

  ngOnInit() {
  }

}
