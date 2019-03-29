import {
  Component, Inject,
  OnInit, Pipe, PipeTransform, ViewChild
} from '@angular/core';
import {Team} from "../../../model/team";
import {MatDialog} from "@angular/material";
import {TeamService2} from "../../../service/team2.service";
import {ManageTeamsPanelComponent} from "../../panel/manage-teams-panel/manage-teams-panel.component";

/**
 * TeamSideBarComponent is used to house the list of teams to be managed.
 *
 * @author Jessica Moffatt
 * @author Karol Talbot
 * @version 2.0
 */

@Component({
  selector: 'app-team-sidebar',
  templateUrl: './team-sidebar.component.html',
  styleUrls: ['./team-sidebar.component.scss']
})
export class TeamSidebarComponent implements OnInit {
  @ViewChild("btn_group") buttonGroup;

  constructor(@Inject(ManageTeamsPanelComponent) private parent: ManageTeamsPanelComponent,
              public dialog: MatDialog, public teamService: TeamService2) {
  }

  ngOnInit() {
    this.teamService.initializeTeams();
  }

  selectTeam(team: Team): void {
    this.parent.setSelectedTeam(team);
  }

  public unselect(teamId: number): void {
    this.buttonGroup.selected.checked = false;
  }
}

@Pipe({name: 'FilterTeamByName'})
export class FilterTeamByName implements PipeTransform {
  transform(teamList: Array<Team>, nameFilter: string): any {
    nameFilter = nameFilter.toLowerCase();
    if (!nameFilter) return teamList;

    return teamList.filter(n => {
      let name = n.teamName;
      name = name.toLowerCase();

      return name.indexOf(nameFilter) >= 0;
    });
  }
}
