import { Component, OnInit } from '@angular/core';
import {ProjectService} from "../../../service/project.service";

@Component({
  selector: 'app-billable-hour-report',
  templateUrl: './billable-hour-report.component.html',
  styleUrls: ['./billable-hour-report.component.scss']
})
export class BillableHourReportComponent implements OnInit {
  displayedColumns: string[] = ['name', 'billableHours','nonBillableHours','billable%'];

  constructor(public projectService:ProjectService) { }

  ngOnInit() {
  }

}
