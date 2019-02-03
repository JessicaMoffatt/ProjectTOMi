import { Component, OnInit } from '@angular/core';
import {AddTeamComponent} from "../add-team/add-team.component";

@Component({
  selector: 'app-team-panel',
  templateUrl: './team-panel.component.html',
  styleUrls: ['./team-panel.component.css']
})
export class TeamPanelComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  createAddTaskComponent(){
    this.add_team_container.clear();
    const factory = this.resolver.resolveComponentFactory(AddTeamComponent);
    this.teamSideBarService.ref = this.add_team_container.createComponent(factory);
  }

}
