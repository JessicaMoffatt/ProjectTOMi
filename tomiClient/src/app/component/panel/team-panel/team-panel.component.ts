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
  private selectedMember:UserAccount;
  constructor(private signInService:SignInService, private teamMemberTimesheetService:TeamMemberTimesheetService) { }
  @ViewChild("individualReport")individualReport;
  @ViewChild("sideBar")sideBar;
  @ViewChild("teamReport")teamReport;

  ngOnInit() {
    this.setSelectedMember(this.signInService.userAccount);
  }

  getTeamId(){
    return this.signInService.userAccount.teamId;
  }

  public setSelectedMember(teamMember:UserAccount){
    this.selectedMember = teamMember;
    this.individualReport.selectedMember = teamMember;
    this.individualReport.getReport();
  }

  public getSelectedMember():UserAccount{
    return this.selectedMember
  }

  public getTeam(){
    return this.sideBar.getTeam();
  }
}
