import {
  Component, ComponentFactory,
  ComponentFactoryResolver,
  ComponentRef,
  OnInit, TemplateRef,
  Type,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import {Team} from "../model/team";
import {TeamSidebarService} from "../team-sidebar.service";
import {TeamService} from "../team.service";
import {AddTeamComponent} from "../add-team/add-team.component";
import {Account} from "../account";

@Component({
  selector: 'app-team-sidebar',
  templateUrl: './team-sidebar.component.html',
  styleUrls: ['./team-sidebar.component.css','../app.component.css']
})
export class TeamSidebarComponent implements OnInit {

  @ViewChild('add_team_container', { read: ViewContainerRef })
  add_team_container: ViewContainerRef;

  constructor(private resolver: ComponentFactoryResolver, private teamSideBarService: TeamSidebarService, private teamService: TeamService) {
  }

  ngOnInit() {
    this.teamSideBarService.findAllTeams().subscribe((data: Array<Team>) => {
      this.teamSideBarService.teams = data;
    });
  }

  displayTeam(team:Team){
    this.teamSideBarService.findTeamById(team.id).subscribe((data:Team) => {
      this.teamSideBarService.selectedTeam = data;
    });

    this.teamService.findTeamMembers(team.id).subscribe((data: Array<Account>) => {
      this.teamService.teamMembers = data;
    });
  }

  createAddTeamComponent(){
    this.add_team_container.clear();
    const factory = this.resolver.resolveComponentFactory(AddTeamComponent);
    this.teamSideBarService.ref = this.add_team_container.createComponent(factory);
  }

}
