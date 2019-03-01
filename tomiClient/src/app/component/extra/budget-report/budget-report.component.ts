import {Component, Input, OnInit} from '@angular/core';
import {Project} from "../../../model/project";

@Component({
  selector: 'app-budget-report',
  templateUrl: './budget-report.component.html',
  styleUrls: ['./budget-report.component.scss']
})
export class BudgetReportComponent implements OnInit {

  @Input() project:Project;
  constructor() { }

  ngOnInit() {
    console.log(this.project);
  }


}
