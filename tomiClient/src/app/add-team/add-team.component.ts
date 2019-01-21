import {Component, OnInit} from '@angular/core';
import {TeamSidebarService} from "../team-sidebar.service";
import {Team} from "../team";
import {TeamService} from "../team.service";

@Component({
  selector: 'app-add-team',
  templateUrl: './add-team.component.html',
  styleUrls: ['./add-team.component.css','../app.component.css']
})
export class AddTeamComponent implements OnInit {

  constructor(private teamSideBarService: TeamSidebarService, private teamService: TeamService) { }

  ngOnInit() {
  }

  //TODO team lead needs to be found!
  addTeam(){
    let team = new Team();
    team.teamName = (<HTMLInputElement>document.getElementById("team_toadd_name")).value;

    team.teamLead = null;

    this.teamService.save(team);
  }

  destroyAddTeamComponent(){
    this.teamSideBarService.destroyAddTeamComponent();
  }

}
