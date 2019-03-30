import {AfterViewInit, Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {TeamMemberTimesheetService} from "../../../service/team-member-timesheet.service";
import {Team} from "../../../model/team";
import {TeamPanelComponent} from "../../panel/team-panel/team-panel.component";

@Component({
  selector: 'app-team-productivity-report',
  templateUrl: './team-productivity-report.component.html',
  styleUrls: ['./team-productivity-report.component.scss']
})
export class TeamProductivityReportComponent implements OnInit{
  displayedColumns: string[] = ['date', 'teamMember', 'unitType','quantity','time', 'normalizedValue'];

  constructor(@Inject(TeamPanelComponent) private parent: TeamPanelComponent ) { }

  ngOnInit() {
  }

  getTeam():string{
    return this.parent.getTeam() === undefined ? "" : this.parent.getTeam().teamName;
  }

}
