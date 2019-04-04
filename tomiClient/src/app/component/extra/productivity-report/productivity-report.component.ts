import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {TeamMemberTimesheetService} from "../../../service/team-member-timesheet.service";
import {MatDatepicker, MatInput, MatSnackBar} from "@angular/material";
import {ErrorService} from "../../../service/error.service";
import {DatePipe} from "@angular/common";

@Component({
  selector: 'app-productivity-report',
  templateUrl: './productivity-report.component.html',
  styleUrls: ['./productivity-report.component.scss']
})
export class ProductivityReportComponent implements OnInit {
  displayedColumns: string[] = ['unitType','quantity','time', 'normalizedValue'];

  @ViewChild('startPicker') startPicker: MatDatepicker<Date>;
  @ViewChild('endPicker') endPicker: MatDatepicker<Date>;

  constructor(public teamMemberTimesheetService:TeamMemberTimesheetService, private datePipe: DatePipe,
              private errorService:ErrorService) { }

  ngOnInit() {

  }

  setRangeOfProductivityReport(){
    if(this.startPicker._selected != null && this.endPicker._selected != null && this.startPicker._selected <= this.endPicker._selected){
      this.teamMemberTimesheetService.setRangeOfProductivityReport(this.startPicker._selected, this.endPicker._selected);
    }else{
      this.errorService.displayError();
    }
  }

  clearRange(startPicker, endPicker){
    startPicker.value = '';
    endPicker.value = '';
    this.startPicker._selected = null;
    this.endPicker._selected = null;
    this.teamMemberTimesheetService.setRangeOfProductivityReport(new Date(0), new Date());
  }

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
