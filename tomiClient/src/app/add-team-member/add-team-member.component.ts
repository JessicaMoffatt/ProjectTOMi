import { Component, OnInit } from '@angular/core';
import {TeamService} from "../team.service";
import {Account} from "../account";
import {UserAccountService} from "../user-account.service";
import {TeamSidebarService} from "../team-sidebar.service";

@Component({
  selector: 'app-add-team-member',
  templateUrl: './add-team-member.component.html',
  styleUrls: ['./add-team-member.component.css','../app.component.css']
})
export class AddTeamMemberComponent implements OnInit {

  constructor(public teamService: TeamService, private teamSidebarService: TeamSidebarService ,private userAccountService: UserAccountService) { }
  selectedMemberModel: any = JSON.stringify(Account);

  ngOnInit() {
    this.teamService.findAllMembers().subscribe((data: Array<Account>) => {
      this.teamService.allMembers = data;
    });
  }

  addMember():void{
    this.selectedMemberModel.teamId = this.teamSidebarService.selectedTeam.id;
    this.userAccountService.save(this.selectedMemberModel);
  }

  destroyAddMemberComponent(): void{
    this.teamService.destroyAddMemberComponent();
  }
}
