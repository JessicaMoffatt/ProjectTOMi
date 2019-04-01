import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {TeamMemberTimesheetService} from "../../../service/team-member-timesheet.service";
import {MatDatepicker} from "@angular/material";

@Component({
  selector: 'app-team-productivity-report',
  templateUrl: './team-productivity-report.component.html',
  styleUrls: ['./team-productivity-report.component.scss']
})
export class TeamProductivityReportComponent implements OnInit {
  displayedColumns: string[] = ['teamMember', 'unitType','quantity','time', 'normalizedValue'];

  @ViewChild('startTeamPicker') startTeamPicker: MatDatepicker<Date>;
  @ViewChild('endTeamPicker') endTeamPicker: MatDatepicker<Date>;

  constructor(public teamMemberTimesheetService:TeamMemberTimesheetService) { }

  ngOnInit() {
  }

  setRangeOfTeamProductivityReport(){
    if(this.startTeamPicker._selected != null && this.endTeamPicker._selected != null && this.startTeamPicker._selected <= this.endTeamPicker._selected){
      this.teamMemberTimesheetService.setRangeOfTeamProductivityReport(this.startTeamPicker._selected, this.endTeamPicker._selected);
    }else{
      //TODO display error snack bar!!
    }
  }

  clearTeamRange(startPicker, endPicker){
    startPicker.value = '';
    endPicker.value = '';
    this.startTeamPicker._selected = null;
    this.endTeamPicker._selected = null;
    this.teamMemberTimesheetService.setRangeOfTeamProductivityReport(new Date(0), new Date());
  }
}
