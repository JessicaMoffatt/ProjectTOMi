import {Component, EventEmitter, HostListener, OnInit, Output} from '@angular/core';
import {TeamService} from "../team.service";
import {Team} from "../team";
import {Observable} from "rxjs";
import {Account} from "../account";

@Component({
  selector: 'app-team',
  providers: [TeamService],
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.css']
})
export class TeamComponent implements OnInit {
  team: Team;
  teamMembers: Account[];

  constructor(private teamService: TeamService) {
  }

  ngOnInit() {
    this.teamService.findTeamById(8).subscribe((data: Team) => {
      this.team = data;
    });
  }

  save(team: Team): Observable<Team>{
    let teamName = (<HTMLInputElement>document.getElementById("team_name")).value;
    team.teamName = teamName;

    return this.teamService.save(team);
  }

  add(): void{

  }
}
