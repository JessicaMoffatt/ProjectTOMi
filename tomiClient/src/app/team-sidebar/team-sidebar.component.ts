import {Component, ComponentFactoryResolver, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {Team} from "../team";
import {TeamSidebarService} from "../team-sidebar.service";
import {TeamService} from "../team.service";
import {AddTeamComponent} from "../add-team/add-team.component";

@Component({
  selector: 'app-team-sidebar',
  templateUrl: './team-sidebar.component.html',
  styleUrls: ['./team-sidebar.component.css','../app.component.css']
})
export class TeamSidebarComponent implements OnInit {
  teams: Team[];
  componentRef: any;

  @ViewChild('add_team_container', { read: ViewContainerRef })
  entry: ViewContainerRef;

  constructor(private resolver: ComponentFactoryResolver, private teamSideBarService: TeamSidebarService, private teamService: TeamService) {
    // teamService.test2$.subscribe(
    //
    // );
  }

  ngOnInit() {
    // this.teamSideBarService.findAllTeams().subscribe((data: Array<Team>) => {
    //   this.teams = data;
    // });
    this.reload();
  }

  reload():void{
    this.teamSideBarService.findAllTeams().subscribe((data: Array<Team>) => {
      this.teams = data;
    });
  }

  createAddTeamComponent(){
    this.entry.clear();
    const factory = this.resolver.resolveComponentFactory(AddTeamComponent);
    this.entry.createComponent(factory);
  }
}
