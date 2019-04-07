import {Component, Input, OnInit} from '@angular/core';
import {TimesheetService} from "../../../service/timesheet.service";
import {MatDatepickerInputEvent, NativeDateAdapter} from "@angular/material";

const millisecondsToDays: number = 86400000;

/**
 * DatePickerComponent is used to display the datepicker used for timesheet selection.
 *
 * @author Jessica Moffatt
 */
@Component({
  selector: 'app-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.scss']
})
export class DatePickerComponent implements OnInit{
  /**
   * The latest date that can be selectedProject.
   */
  private maxDate: Date;
  /**
   * The earliest date that can be selectedProject.
   */
  @Input() private minDate: Date;

  /**
   * The selectedProject date.
   */
  private selectedDate: Date;
  /**
   * The parent component of this component.
   */
  @Input() private parent;

  constructor(private timesheetService: TimesheetService){
    this.maxDate = new Date();
  }

  ngOnInit(): void {
  }

  /**
   * Sets the minimum date.
   */
  doSetMinDate(){
    this.timesheetService.doSetMinDate();
  }

  /**
   * Changes the selectedProject date and displays the corresponding timesheet.
   * @param event The date selectedProject.
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
    let weeks = Math.floor((days / millisecondsToDays + 6) / 7) ;
    this.parent.displaySpecifiedTimesheet(weeks);
  }
}

/**
 * Inner class used to set the starting day of the week to Monday.
 */
export class CustomDateAdapter extends NativeDateAdapter{

  getFirstDayOfWeek(): number {
    return 1;
  }
}
