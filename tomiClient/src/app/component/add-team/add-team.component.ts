import {Component, OnInit} from '@angular/core';
import {TeamSidebarService} from "../../service/team-sidebar.service";
import {Team} from "../../model/team";
import {TeamService} from "../../service/team.service";
import {UserAccount} from "../../model/userAccount";
import {UserAccountService} from "../../service/user-account.service";

/**
 * AddTeamComponent is used to facilitate communication between the view and front end services.
 *
 * @author Jessica Moffatt
 * @version 1.0
 */
@Component({
  selector: 'app-add-team',
  templateUrl: './add-team.component.html',
  styleUrls: ['./add-team.component.css','../../app.component.css']
})
export class AddTeamComponent implements OnInit {

  constructor(private teamSideBarService: TeamSidebarService, public teamService: TeamService, private userAccountService: UserAccountService) { }

  /**
   * On initialization of this component, assigns the team service's list of all members.
   */
  ngOnInit() {
    this.teamService.getAllMembers().subscribe((data: Array<UserAccount>) => {
      this.teamService.allMembers = data;
    });
  }

  /**
   * Adds a new team. Passes on the request to save the new team to the team service. If a team lead is selected, also passes
   * on the request to save the user account's info to the user account service.
   */
  addTeam(){
    let team = new Team();
    team.teamName = (<HTMLInputElement>document.getElementById("team_toadd_name")).value;
    let leadId = Number((<HTMLInputElement>document.getElementById("team_toadd_lead")).value);
    team.leadId = leadId;

    this.teamService.save(team).then(value => {
      this.teamSideBarService.teams.push(value);

      if(team.leadId !== -1){
        this.teamService.getTeamMemberById(leadId).subscribe((data: UserAccount)=> {
          let tempAccount = data;
          tempAccount.teamId = value.id;
          this.userAccountService.save(tempAccount);
        });
      }
      this.teamSideBarService.destroyAddTeamComponent();
    });
  }

  /**
   * Destroys the dynamically created add team component.
   */
  destroyAddTeamComponent(){
    this.teamSideBarService.destroyAddTeamComponent();
  }

}
