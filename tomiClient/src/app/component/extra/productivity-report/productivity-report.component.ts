import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {TeamPanelComponent} from "../../panel/team-panel/team-panel.component";
import {UserAccount} from "../../../model/userAccount";
import {ProductivityReportLine} from "../../../model/productivityReportLine";
import {TeamMemberTimesheetComponent} from "../../panel/team-member-timesheet/team-member-timesheet.component";
import {TeamMemberTimesheetService} from "../../../service/team-member-timesheet.service";
import {MatSort} from "@angular/material";

@Component({
  selector: 'app-productivity-report',
  templateUrl: './productivity-report.component.html',
  styleUrls: ['./productivity-report.component.scss']
})
export class ProductivityReportComponent implements OnInit {
  selectedMember: UserAccount;
  displayedColumns: string[] = ['date', 'unitType', 'quantity', 'time', 'normalizedValue'];
  report: ProductivityReportLine[] = [];

  constructor(@Inject(TeamPanelComponent) private parent: TeamPanelComponent,
              public teamMemberTimesheetService: TeamMemberTimesheetService) {
  }

  ngOnInit() {

  }

  getReport() {
    if (this.selectedMember !== undefined) {
      let a = this.teamMemberTimesheetService.getProductivityReportByMember(this.selectedMember);
      if (a !== null) {
        a.forEach((value) => {
          this.report = value as ProductivityReportLine[];
        });
      }
    }
  }
}
