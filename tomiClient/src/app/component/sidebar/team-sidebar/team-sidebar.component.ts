import {
  Component, ComponentFactory,
  ComponentFactoryResolver,
  ComponentRef,
  OnInit, TemplateRef,
  Type,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import {Team} from "../../../model/team";
import {TeamSidebarService} from "../../../service/team-sidebar.service";
import {TeamService} from "../../../service/team.service";
import {AddTeamComponent} from "../../modal/add-team/add-team.component";
import {UserAccount} from "../../../model/userAccount";

@Component({
  selector: 'app-team-sidebar',
  templateUrl: './team-sidebar.component.html',
  styleUrls: ['./team-sidebar.component.scss']
})
export class TeamSidebarComponent implements OnInit {

  @ViewChild('add_team_container', { read: ViewContainerRef })
  add_team_container: ViewContainerRef;

  constructor(private resolver: ComponentFactoryResolver, private teamSideBarService: TeamSidebarService, private teamService: TeamService) {
  }

  ngOnInit() {
    this.teamSideBarService.getAllTeams().subscribe((data: Array<Team>) => {
      this.teamSideBarService.teams = data;
    });
  }

  displayTeam(team:Team){
    this.teamSideBarService.getTeamById(team.id).subscribe((data:Team) => {
      this.teamSideBarService.selectedTeam = data;
    });

    this.teamService.getTeamMembers(team.id).subscribe((data: Array<UserAccount>) => {
      this.teamService.teamMembers = data;
    });
  }

  createAddTeamComponent(){
    this.add_team_container.clear();
    const factory = this.resolver.resolveComponentFactory(AddTeamComponent);
    this.teamSideBarService.ref = this.add_team_container.createComponent(factory);
  }

}
