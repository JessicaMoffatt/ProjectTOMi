import {Component, OnInit} from '@angular/core';
import {TeamService} from "../team.service";
import {Team} from "../team";
import {Observable} from "rxjs";
import {Account} from "../account";
import {TeamSidebarService} from "../team-sidebar.service";

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.css','../app.component.css']
})
export class TeamComponent implements OnInit {

  constructor(public teamService: TeamService, public teamSideBarService: TeamSidebarService) {
  }

  ngOnInit() {
  }

  displayAddMember(){

  }

  save(team: Team): Observable<Team>{
    team.teamName = (<HTMLInputElement>document.getElementById("team_name")).value;

    return this.teamService.save(team);
  }

  delete(team: Team): Observable<Team>{
    this.teamSideBarService.teams = this.teamSideBarService.teams.filter(t => t !== team);
    return this.teamService.delete(team);
  }

  //TODO finish
  archive(team:Team): Observable<Team>{
    return null;
  }

  addMember(user_account: Account,team: Team): Observable<Account>{
    user_account.team = team;
    return this.teamService.addTeamMember(user_account);
  }
}
