import {AfterViewInit, Component, OnInit} from '@angular/core';
import {ProjectService} from "../../../service/project.service";
import {DatePipe} from "@angular/common";
import {MatSnackBar} from "@angular/material";

@Component({
  selector: 'app-data-dump-report',
  templateUrl: './data-dump-report.component.html',
  styleUrls: ['./data-dump-report.component.scss']
})
export class DataDumpReportComponent implements OnInit {

  constructor(private projectService:ProjectService, private datePipe: DatePipe, public snackBar:MatSnackBar) { }

  ngOnInit() {

  }

  /**
   * Retrieves the data dump report for download in xls format.
   */
  getDataDump() {
    this.projectService.getDataDump().subscribe(
      data => {
        let link = document.createElement('a');
        let stuff = window.URL.createObjectURL(data);
        link.href = stuff;
        document.body.appendChild(link);
        let today = new Date();
        let dateString = this.datePipe.transform(today, "yyyy-MM-dd");

        link.download = "Data_Dump_" + dateString+".xls";

        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(stuff);

      },
      err => {
        let errorMessage = 'Something went wrong when updating retrieving the data dump report.';
        this.snackBar.open(errorMessage, null, {duration: 5000, politeness: 'assertive', panelClass: 'snackbar-fail', horizontalPosition: 'right'});
      });
  }
}
