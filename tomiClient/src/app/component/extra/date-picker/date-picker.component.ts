import {AfterViewInit, Component, Input, OnInit} from '@angular/core';
import {TimesheetService} from "../../../service/timesheet.service";
import {TeamMemberTimesheetService} from "../../../service/team-member-timesheet.service";
import {MatDatepickerInputEvent, NativeDateAdapter} from "@angular/material";

const millisecondsToDays: number = 86400000;

/**
 * DatePickerComponent is used to display the datepicker used for timesheet selection.
 */
@Component({
  selector: 'app-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.scss']
})
export class DatePickerComponent implements OnInit{
  horse: boolean;
  /**
   * The latest date that can be selected.
   */
  maxDate: Date;
  /**
   * The earliest date that can be selected.
   */
  @Input() minDate: Date;

  /**
   * The selected date.
   */
  selectedDate: Date;
  /**
   * The parent component of this component.
   */
  @Input() parent;

  constructor(private timesheetService: TimesheetService, private teamMemberTimesheetService:TeamMemberTimesheetService){
    this.maxDate = new Date();
    this.horse = true;
  }

  ngOnInit(): void {
    console.log("HERE");
  }

  doSetMinDate(){
    this.timesheetService.doSetMinDate();
  }

  /**
   * Changes the selected date and displays the corresponding timesheet.
   * @param event The date selected.
   */
  onDateChange(event: MatDatepickerInputEvent<Date>): void {
    let day = event.value.getDay();
    if (day === 0) {
      day = 7;
    }
    let selectedMonday = event.value.getDate() - day + 1;

    this.selectedDate = new Date(event.value);
    this.selectedDate.setDate(selectedMonday);
    this.selectedDate.setHours(0, 0, 0, 0);

    let currentDay = new Date(this.timesheetService.currentDate);

    let days = +(currentDay) - +this.selectedDate;
    let weeks = days / millisecondsToDays / 7;

    this.parent.displaySpecifiedTimesheet(weeks);
  }
}

export class CustomDateAdapter extends NativeDateAdapter{

  getFirstDayOfWeek(): number {
    return 1;
  }
}
