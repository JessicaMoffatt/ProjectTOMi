import {Component, OnInit} from '@angular/core';
import {TeamService} from "../../service/team.service";
import {UserAccount} from "../../model/userAccount";
import {UserAccountService} from "../../service/user-account.service";
import {TeamSidebarService} from "../../service/team-sidebar.service";

/**
 * AddTeamMemberComponent is used to facilitate communication between the view and front end services.
 *
 * @author Jessica Moffatt
 * @version 1.0
 */
@Component({
  selector: 'app-add-team-member',
  templateUrl: './add-team-member.component.html',
  styleUrls: ['./add-team-member.component.scss', '../../app.component.scss']
})
export class AddTeamMemberComponent implements OnInit {

  constructor(public teamService: TeamService, private teamSidebarService: TeamSidebarService, private userAccountService: UserAccountService) {
  }

  /**
   * On initialization of this component, assigns the team service's list of all members.
   */
  ngOnInit() {
    this.teamService.getAllMembers().subscribe((data: Array<UserAccount>) => {
      this.teamService.allMembers = data;
    });
  }

  //TODO add error handling
  /**
   * Adds the selected team member to the team. Passes on requests to save this information to the user account service and team service.
   */
  addMember(): void {
    let memberId = Number((<HTMLInputElement>document.getElementById("selected_member")).value);

    let toAdd: UserAccount = new UserAccount();

    this.teamService.getTeamMemberById(memberId).subscribe((data: UserAccount) => {
      toAdd = data;
      toAdd.teamId = this.teamSidebarService.selectedTeam.id;

      this.userAccountService.save(toAdd);
      this.teamService.teamMembers.push(toAdd);
    });
  }

  /**
   * Destroys the dynamically created add member component.
   */
  destroyAddMemberComponent(): void {
    this.teamService.destroyAddMemberComponent();
  }
}
