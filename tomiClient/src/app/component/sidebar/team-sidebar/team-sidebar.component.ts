import {
  Component, HostListener, Inject,
  OnInit, Pipe, PipeTransform, ViewChild
} from '@angular/core';
import {Team} from "../../../model/team";
import {MatDialog} from "@angular/material";
import {TeamService} from "../../../service/team.service";
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
  /**
   * The button group for displaying all the teams.
   */
  @ViewChild("btn_group") buttonGroup;

  /**
   * Listens for the Ctrl+f key's keydown event; Moves focus to the search bar on that event.
   * @param e The event captured.
   */
  @HostListener('window:keydown.Control.f', ['$event']) w(e: KeyboardEvent) {
    e.preventDefault();
    document.getElementById("team_search").focus();
  }

  constructor(@Inject(ManageTeamsPanelComponent) private parent: ManageTeamsPanelComponent,
              public dialog: MatDialog, public teamService: TeamService) {
  }

  ngOnInit() {
    this.teamService.initializeTeams();

  }

  /**
   * Sets the selected Team.
   * @param team The Team to set the selected Team to.
   */
  selectTeam(team: Team): void {
    this.parent.setSelectedTeam(team);
  }

  /**
   * Unselects the specified Team.
   * @param teamId
   */
  public unselect(teamId: number): void {
    this.buttonGroup.selected.checked = false;
  }

  /**
   * Sets the button group to the specified Team.
   * @param teamId The Team to set the button group to.
   */
  setSelectedTeam(team:Team){
    this.buttonGroup = team;
  }
}

/**
 * Pipe used to filter Teams by their name.
 */
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
