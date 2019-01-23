import {Component, ComponentFactoryResolver, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {TeamService} from "../team.service";
import {Team} from "../team";
import {Observable} from "rxjs";
import {Account} from "../account";
import {TeamSidebarService} from "../team-sidebar.service";
import {AddTeamComponent} from "../add-team/add-team.component";
import {AddTeamMemberComponent} from "../add-team-member/add-team-member.component";

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.css','../app.component.css']
})
export class TeamComponent implements OnInit {

  @ViewChild('add_team_member_container', { read: ViewContainerRef })
  add_team_member_container: ViewContainerRef;

  selectedLeadModel: any = JSON.stringify(Account);

  constructor(private resolver: ComponentFactoryResolver, public teamService: TeamService, public teamSideBarService: TeamSidebarService) {
  }

  ngOnInit() {
  }

  selectMember(account:Account){
    this.teamService.setSelectMember(account);
  }

  removeMember(){
    this.teamService.removeMember();
  }

  createAddMemberComponent(){
    this.add_team_member_container.clear();
    const factory = this.resolver.resolveComponentFactory(AddTeamMemberComponent);
    this.teamService.ref = this.add_team_member_container.createComponent(factory);
  }

  save(team: Team): Observable<Team>{
    team.teamName = (<HTMLInputElement>document.getElementById("team_name")).value;
    team.teamLead = this.selectedLeadModel;
    return this.teamService.save(team);
  }

  delete(team: Team): Observable<Team>{
    return this.teamService.delete(team);
  }

  cancel(team: Team): void{
     this.teamService.cancel(team);
  }
}
