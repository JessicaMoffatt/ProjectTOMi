import {Component, Input, OnInit} from '@angular/core';
import {Project} from "../../../model/project";
import {ProjectService} from "../../../service/project.service";

/**
 *  BudgetReportComponent is used to facilitate communication between the budget report view
 *  and front end services.
 *
 *  @author Jessica Moffatt
 */
@Component({
  selector: 'app-budget-report',
  templateUrl: './budget-report.component.html',
  styleUrls: ['./budget-report.component.scss']
})
export class BudgetReportComponent implements OnInit {

  @Input() project:Project;
  constructor(public projectService:ProjectService) { }

  ngOnInit() {

  }
}
