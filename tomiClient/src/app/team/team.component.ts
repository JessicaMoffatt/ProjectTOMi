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
    let leadId = Number((<HTMLInputElement>document.getElementById("selected_team_lead")).value);

    let lead = null;

    if(leadId !== -1){
      this.teamService.findTeamMemberById(leadId).subscribe((data:Account) => {
        lead = data;

        team.teamLead = lead;
      });
    }else{
      team.teamLead = null;
    }

    console.log(team);

    return this.teamService.save(team);
  }

  test(){
    // let t = (<HTMLInputElement>document.getElementById("selected_team_lead")).value;
    // console.log(t);
  }

  delete(team: Team): Observable<Team>{
    return this.teamService.delete(team);
  }

  cancel(team: Team): void{
     this.teamService.cancel(team);
  }
}
