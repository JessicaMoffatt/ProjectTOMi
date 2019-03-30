import {Component, Inject, OnInit} from '@angular/core';
import {TeamPanelComponent} from "../../panel/team-panel/team-panel.component";
import {UserAccount} from "../../../model/userAccount";

@Component({
  selector: 'app-productivity-report',
  templateUrl: './productivity-report.component.html',
  styleUrls: ['./productivity-report.component.scss']
})
export class ProductivityReportComponent implements OnInit {
  selectedMember:UserAccount;
  displayedColumns: string[] = ['date', 'unitType','quantity','time', 'normalizedValue'];

  constructor( @Inject(TeamPanelComponent) private parent: TeamPanelComponent) { }

  ngOnInit() {

  }

}
