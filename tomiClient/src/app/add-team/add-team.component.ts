import {Component, OnInit} from '@angular/core';
import {TeamSidebarService} from "../team-sidebar.service";
import {Team} from "../team";
import {TeamService} from "../team.service";
import {Account} from "../account";

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
    let teamLeadString = (<HTMLInputElement>document.getElementById("team_toadd_lead")).value;

    console.log(teamLeadString);

    let teamLead = null;

    if(teamLeadString !== null && teamLeadString.trim() !== ""){
      try{
        teamLead = JSON.parse(teamLeadString) as Account;
      }
        //TODO make this more meaningful
      catch(e){
        console.log(e);
      }
    }

    if(teamLead !== null){
      this.teamService.findTeamMemberById(teamLead.id).subscribe((data: Account) => {
        team.teamLead = data;
      });
    }

    this.teamService.save(team);
  }

  destroyAddTeamComponent(){
    this.teamSideBarService.destroyAddTeamComponent();
  }

}
