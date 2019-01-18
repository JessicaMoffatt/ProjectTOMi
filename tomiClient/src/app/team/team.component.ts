import {Component, OnInit} from '@angular/core';
import {TeamService} from "../team.service";
import {Team} from "../team";

@Component({
  selector: 'app-team',
  providers: [TeamService],
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.css']
})
export class TeamComponent implements OnInit {
  teams: Team[];
  team: Team;

  constructor(private teamService: TeamService) {
  }

  ngOnInit() {
    this.teamService.findAllTeams().subscribe((data: Array<Team>) => {
      this.teams = data;
    });

    this.teamService.findTeamById(7).subscribe((data: Team) => {
      this.team = data;
      console.log(this.team);
    });
  }
}
