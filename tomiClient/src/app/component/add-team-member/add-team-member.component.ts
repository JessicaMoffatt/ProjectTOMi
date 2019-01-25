import { Component, OnInit } from '@angular/core';
import {TeamService} from "../../service/team.service";
import {Account} from "../../model/account";
import {UserAccountService} from "../../service/user-account.service";
import {TeamSidebarService} from "../../service/team-sidebar.service";
import {Team} from "../../model/team";

@Component({
  selector: 'app-add-team-member',
  templateUrl: './add-team-member.component.html',
  styleUrls: ['./add-team-member.component.css','../../app.component.css']
})
export class AddTeamMemberComponent implements OnInit {

  constructor(public teamService: TeamService, private teamSidebarService: TeamSidebarService ,private userAccountService: UserAccountService) { }

  ngOnInit() {
    this.teamService.findAllMembers().subscribe((data: Array<Account>) => {
      this.teamService.allMembers = data;
    });
  }

  //TODO add error handling
  addMember():void{
    let memberId =  Number((<HTMLInputElement>document.getElementById("selected_member")).value);

    let toAdd: Account = new Account();

    this.teamService.findTeamMemberById(memberId).subscribe((data:Account) => {
      toAdd = data;
      toAdd.teamId = this.teamSidebarService.selectedTeam.id;

      this.userAccountService.save(toAdd);
      this.teamService.teamMembers.push(toAdd);
    });
  }

  destroyAddMemberComponent(): void{
    this.teamService.destroyAddMemberComponent();
  }
}
