import {Component, Input} from '@angular/core';
import {TimesheetService} from "../../../service/timesheet.service";
import {TimesheetComponent} from "../../panel/timesheet/timesheet.component";

const millisecondsToDays:number = 86400000;

@Component({
  selector: 'app-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.scss']
})
export class DatePickerComponent{

  maxDate: Date;
  minDate: Date;
  selectedDate: Date;
  @Input() parent;


  constructor(private timesheetService: TimesheetService){
    this.maxDate = new Date();
  }

  doSetMinDate(){
    if(this.minDate === undefined || this.minDate === null){
      this.setMinDate().then();
    }
  }

  async setMinDate(){
    await this.timesheetService.getEarliestDate().then((data)=>{
      let dateString = data.toString().replace(/-/g, '\/').replace(/T.+/, '');

      this.minDate = new Date(dateString);
      return this.minDate;
    });
  }

  onDateChange(value: Date):void{
    let day = value.getDay();
    if(day === 0){
     day = 7;
    }
    let selectedMonday = value.getDate() - day +1;

    this.selectedDate = new Date(value);
    this.selectedDate.setDate(selectedMonday);
    this.selectedDate.setHours(0,0,0,0);

    let currentDay = new Date(this.timesheetService.currentDate);

    let days = +(currentDay) - +this.selectedDate;
    let weeks = days/millisecondsToDays/7;

    this.parent.displaySpecifiedTimesheet(weeks);
  }
}
