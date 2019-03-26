import {
  Component,
  ComponentFactoryResolver, Inject,
  OnInit, ViewChild
} from '@angular/core';
import {Team} from "../../../model/team";
import {TeamService} from "../../../service/team.service";
import {MatDialog} from "@angular/material";
import {TeamService2} from "../../../service/team2.service";
import {ManageTeamsPanelComponent} from "../../panel/manage-teams-panel/manage-teams-panel.component";

/**
 * TeamSideBarComponent is used to house the list of teams to be managed.
 *
 * @author Jessica Moffatt
 * @version 2.0
 */

@Component({
  selector: 'app-team-sidebar',
  templateUrl: './team-sidebar.component.html',
  styleUrls: ['./team-sidebar.component.scss']
})
export class TeamSidebarComponent implements OnInit {
  @ViewChild("btn_group") btn_group;

  constructor(@Inject(ManageTeamsPanelComponent) private parent: ManageTeamsPanelComponent,
              private resolver: ComponentFactoryResolver, private teamService: TeamService,
              public dialog: MatDialog, public team2: TeamService2) {
  }

  ngOnInit() {
    this.team2.initializeTeams();
  }

  selectTeam(team: Team): void {
    this.parent.setSelectedTeam(team);
  }

  public unselect(teamId:number){
    this.btn_group.selected.checked = false;
  }
}
