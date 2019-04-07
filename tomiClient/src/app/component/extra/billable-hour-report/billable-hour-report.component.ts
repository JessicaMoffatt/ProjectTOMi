import { Component, OnInit } from '@angular/core';
import {ProjectService} from "../../../service/project.service";
import {BillableHoursReportLine} from "../../../model/billableHoursReportLine";
import {HttpErrorResponse} from "@angular/common/http";
import {throwError} from "rxjs";
import {DatePipe} from "@angular/common";
import {MatSnackBar} from "@angular/material";
import {ErrorService} from "../../../service/error.service";

/**
 *  BillableHourReportComponent is used to facilitate communication between the billable hour report view
 *  and front end services.
 *
 *  @author Jessica Moffatt
 */
@Component({
  selector: 'app-billable-hour-report',
  templateUrl: './billable-hour-report.component.html',
  styleUrls: ['./billable-hour-report.component.scss']
})
export class BillableHourReportComponent implements OnInit {
  /**
   * The columns to be displayed for the billable hour report.
   */
  displayedColumns: string[] = ['name', 'billableHours','nonBillableHours','billable%'];

  constructor(public projectService:ProjectService, private datePipe: DatePipe, public snackBar:MatSnackBar,
              private errorService:ErrorService) { }

  ngOnInit() {
    this.projectService.getBillableReport().subscribe(data => {
      this.projectService.billableReport = data;
      this.projectService.billableReport.sort(BillableHoursReportLine.compareName);
    }, error => {
      this.handleError
    });
  }

  /**
   * Generic error handling method. Throws the caught error.
   * @param error The caught HttpErrorResponse error.
   */
  private handleError(error: HttpErrorResponse) {
    return throwError(error.message);
  }

  /**
   * Retrieves the billable hour report for download in xls format.
   */
  downloadBillableHourReport(){
    this.projectService.downloadBillableReport().subscribe(
      data => {
        let link = document.createElement('a');
        let stuff = window.URL.createObjectURL(data);
        link.href = stuff;
        document.body.appendChild(link);
        let today = new Date();
        let dateString = this.datePipe.transform(today, "yyyy-MM-dd");

        link.download = "Billable_Hour_" + dateString+".xls";

        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(stuff);

      },
      err => {
        this.errorService.displayError();
      });
  }
}
