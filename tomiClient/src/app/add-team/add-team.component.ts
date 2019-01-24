import {Component, OnInit} from '@angular/core';
import {TeamSidebarService} from "../team-sidebar.service";
import {Team} from "../team";
import {TeamService} from "../team.service";
import {Account} from "../account";
import {UserAccountService} from "../user-account.service";

@Component({
  selector: 'app-add-team',
  templateUrl: './add-team.component.html',
  styleUrls: ['./add-team.component.css','../app.component.css']
})
export class AddTeamComponent implements OnInit {

  constructor(private teamSideBarService: TeamSidebarService, private teamService: TeamService, private userAccountService: UserAccountService) { }

  ngOnInit() {
    this.teamService.findAllMembers().subscribe((data: Array<Account>) => {
      this.teamService.allMembers = data;
    });
  }

  //TODO team lead needs to be found!
  addTeam(){
    let team = new Team();
    team.teamName = (<HTMLInputElement>document.getElementById("team_toadd_name")).value;
    let leadId = Number((<HTMLInputElement>document.getElementById("team_toadd_lead")).value);
    team.leadId = leadId;

    // this.teamService.save(team).subscribe((data: Team) => {
    //   // tempAccount.teamId = data.id;
    //   // this.userAccountService.save(tempAccount);
    //
    //   // this.teamService.findTeamMemberById(leadId).subscribe((data: Account)=> {
    //   //   let tempAccount = data;
    //   // });
    // });
    this.teamService.save(team);

  }

  destroyAddTeamComponent(){
    this.teamSideBarService.destroyAddTeamComponent();
  }

}
