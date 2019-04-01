import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {TeamMemberTimesheetService} from "../../../service/team-member-timesheet.service";
import {MatDatepicker, MatInput} from "@angular/material";
import {ErrorService} from "../../../service/error.service";

@Component({
  selector: 'app-productivity-report',
  templateUrl: './productivity-report.component.html',
  styleUrls: ['./productivity-report.component.scss']
})
export class ProductivityReportComponent implements OnInit {
  displayedColumns: string[] = ['unitType','quantity','time', 'normalizedValue'];

  @ViewChild('startPicker') startPicker: MatDatepicker<Date>;
  @ViewChild('endPicker') endPicker: MatDatepicker<Date>;

  constructor(public teamMemberTimesheetService:TeamMemberTimesheetService, private errorService:ErrorService) { }

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
}
