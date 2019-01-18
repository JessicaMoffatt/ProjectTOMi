import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-timesheet-panel',
  templateUrl: './timesheet-panel.component.html',
  styleUrls: ['./timesheet-panel.component.css']
})
export class TimesheetPanelComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    console.log("this is a test.  you can delete me");
  }

}
