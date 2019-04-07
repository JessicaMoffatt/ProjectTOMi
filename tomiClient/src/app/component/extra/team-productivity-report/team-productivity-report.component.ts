import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {TeamMemberTimesheetService} from "../../../service/team-member-timesheet.service";
import {MatDatepicker} from "@angular/material";
import {ErrorService} from "../../../service/error.service";

/**
 *  TeamProductivityReportComponent is used to facilitate communication between the team productivity report view
 *  and front end services.
 *
 *  @author Jessica Moffatt
 */
@Component({
  selector: 'app-team-productivity-report',
  templateUrl: './team-productivity-report.component.html',
  styleUrls: ['./team-productivity-report.component.scss']
})
export class TeamProductivityReportComponent implements OnInit {
  /**
   * The columns to be displayed for the team productivity report.
   */
  displayedColumns: string[] = ['teamMember', 'unitType', 'quantity', 'time', 'normalizedValue'];

  /**
   * The datepicker for choosing the start time for the team productivity report.
   */
  @ViewChild('startTeamPicker') startTeamPicker: MatDatepicker<Date>;

  /**
   * The datepicker for choosing the end time for the team productivity report.
   */
  @ViewChild('endTeamPicker') endTeamPicker: MatDatepicker<Date>;

  constructor(public teamMemberTimesheetService: TeamMemberTimesheetService, private errorService: ErrorService) {
  }

  ngOnInit() {
  }

  /**
   * Using the values in the startTeamPicker and endTeamPicker, sets the range of values to display for the
   * team productivity report.
   */
  setRangeOfTeamProductivityReport() {
    if (this.startTeamPicker._selected != null && this.endTeamPicker._selected != null && this.startTeamPicker._selected <= this.endTeamPicker._selected) {
      this.teamMemberTimesheetService.setRangeOfTeamProductivityReport(this.startTeamPicker._selected, this.endTeamPicker._selected);
    } else {
      this.errorService.displayError();
    }
  }

  /**
   * Clears the selected range of dates.
   * @param startPicker The datepicker used for choosing the start date of the team productivity report.
   * @param endPicker The datepicker used for choosing the end date of the team productivity report.
   */
  clearTeamRange(startPicker, endPicker) {
    startPicker.value = '';
    endPicker.value = '';
    this.startTeamPicker._selected = null;
    this.endTeamPicker._selected = null;
    this.teamMemberTimesheetService.setRangeOfTeamProductivityReport(new Date(0), new Date());
  }
}
