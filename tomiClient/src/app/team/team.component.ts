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


  constructor(private teamService: TeamService, private teamSideBarService: TeamSidebarService) {
  }

  ngOnInit() {
    // this.teamSideBarService.findTeamById(9).subscribe((data: Team) => {
    //   this.team = data;
    // });
    //
    // this.teamService.findTeamMembers(9).subscribe((data: Array<Account>) => {
    //   this.teamMembers = data;
    // });
  }

  save(team: Team): Observable<Team>{
    team.teamName = (<HTMLInputElement>document.getElementById("team_name")).value;

    return this.teamService.save(team);
  }
}
