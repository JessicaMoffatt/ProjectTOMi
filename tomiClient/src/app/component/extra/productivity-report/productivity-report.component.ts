import {Component, OnInit, ViewChild} from '@angular/core';
import {TeamMemberTimesheetService} from "../../../service/team-member-timesheet.service";
import {MatDatepicker} from "@angular/material";
import {ErrorService} from "../../../service/error.service";
import {DatePipe} from "@angular/common";

/**
 *  ProductivityReportComponent is used to facilitate communication between the individual productivity report view
 *  and front end services.
 *
 *  @author Jessica Moffatt
 */
@Component({
  selector: 'app-productivity-report',
  templateUrl: './productivity-report.component.html',
  styleUrls: ['./productivity-report.component.scss']
})
export class ProductivityReportComponent implements OnInit {
  /**
   * The columns to be displayed for the individual productivity report.
   */
  displayedColumns: string[] = ['unitType','quantity','time', 'normalizedValue'];

  /**
   * The datepicker for choosing the start time for the team productivity report.
   */
  @ViewChild('startPicker') startPicker: MatDatepicker<Date>;

  /**
   * The datepicker for choosing the end time for the team productivity report.
   */
  @ViewChild('endPicker') endPicker: MatDatepicker<Date>;

  constructor(public teamMemberTimesheetService:TeamMemberTimesheetService, private datePipe: DatePipe,
              private errorService:ErrorService) { }

  ngOnInit() {

  }

  /**
   * Using the values in the startTeamPicker and endTeamPicker, sets the range of values to display for the
   * individual productivity report.
   */
  setRangeOfProductivityReport(){
    if(this.startPicker._selected != null && this.endPicker._selected != null && this.startPicker._selected <= this.endPicker._selected){
      this.teamMemberTimesheetService.setRangeOfProductivityReport(this.startPicker._selected, this.endPicker._selected);
    }else{
      this.errorService.displayError();
    }
  }

  /**
   * Clears the selected range of dates.
   * @param startPicker The datepicker used for choosing the start date of the individual productivity report.
   * @param endPicker The datepicker used for choosing the end date of the individual productivity report.
   */
  clearRange(startPicker, endPicker){
    startPicker.value = '';
    endPicker.value = '';
    this.startPicker._selected = null;
    this.endPicker._selected = null;
    this.teamMemberTimesheetService.setRangeOfProductivityReport(new Date(0), new Date());
  }

  /**
   * Facilitates the downloading of the individual productivity report.
   */
  downloadProductivityReport(){
    this.teamMemberTimesheetService.downloadProductivityReport().subscribe(
      data => {
        let link = document.createElement('a');
        let stuff = window.URL.createObjectURL(data);
        link.href = stuff;
        document.body.appendChild(link);
        let today = new Date();
        let dateString = this.datePipe.transform(today, "yyyy-MM-dd");

        link.download = "Productivity_Report_" + dateString+".xls";

        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(stuff);

      },
      err => {
        this.errorService.displayError();
      });
  }
}
