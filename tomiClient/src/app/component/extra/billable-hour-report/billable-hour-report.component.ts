import { Component, OnInit } from '@angular/core';
import {ProjectService} from "../../../service/project.service";
import {BillableHoursReportLine} from "../../../model/billableHoursReportLine";
import {HttpErrorResponse} from "@angular/common/http";
import {throwError} from "rxjs";

@Component({
  selector: 'app-billable-hour-report',
  templateUrl: './billable-hour-report.component.html',
  styleUrls: ['./billable-hour-report.component.scss']
})
export class BillableHourReportComponent implements OnInit {
  displayedColumns: string[] = ['name', 'billableHours','nonBillableHours','billable%'];

  constructor(public projectService:ProjectService) { }

  ngOnInit() {
    this.projectService.getBillableReport().subscribe(data => {
      this.projectService.billableReport = data;
      this.projectService.billableReport.sort(BillableHoursReportLine.compareName);
    }, error => {
      this.handleError
    });
  }

  private handleError(error: HttpErrorResponse) {
    return throwError(error.message);
  }
}
