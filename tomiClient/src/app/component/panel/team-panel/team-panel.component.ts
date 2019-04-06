import {Component, OnInit, ViewChild} from '@angular/core';

/**
 * TeamPanelComponent is used to hold other components related to teams.
 */
@Component({
  selector: 'app-team-panel',
  templateUrl: './team-panel.component.html',
  styleUrls: ['./team-panel.component.scss']
})
export class TeamPanelComponent implements OnInit {

  /**
   * The individual productivity report component within this team panel component.
   */
  @ViewChild("individualReport")individualReport;

  /**
   * The team side bar component within this team panel component.
   */
  @ViewChild("sideBar")sideBar;

  /**
   * The team productivity report component within this team panel component.
   */
  @ViewChild("teamReport")teamReport;

  constructor() {

  }

  ngOnInit() {
  }
}
