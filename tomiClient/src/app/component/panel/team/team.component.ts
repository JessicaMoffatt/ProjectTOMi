import {AfterViewInit, Component, ComponentFactoryResolver, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {TeamService} from "../../../service/team.service";
import {Team} from "../../../model/team";
import {UserAccount} from "../../../model/userAccount";
import {TeamSidebarService} from "../../../service/team-sidebar.service";
import {AddTeamMemberComponent} from "../../modal/add-team-member/add-team-member.component";
import {MatSelectionList, MatSelectionListChange} from "@angular/material";

/**
 * TeamComponent is used to facilitate communication between the view and front end services.
 *
 * @author Jessica Moffatt
 * @version 1.0
 */
@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.scss']
})
export class TeamComponent implements OnInit {

  /** A view container ref for the template that will be used to house the add team member component.*/
  @ViewChild('add_team_member_container', {read: ViewContainerRef})
  add_team_member_container: ViewContainerRef;

  @ViewChild('teamMemberList') teamMemberList: MatSelectionList;

  constructor(private resolver: ComponentFactoryResolver, public teamService: TeamService,
              public teamSideBarService: TeamSidebarService) {
  }

  ngOnInit() {

  }

  /**
   * Sets the selected team members.
   * @param event The event to be captured.
   * @param selectedMembers The selected values.
   */
  onSelection(event, selectedMembers) {
    let tempList: UserAccount[] = [];
    for(let m of selectedMembers) {
      tempList.push(m.value);
    }
    this.teamService.setSelectMembers(tempList);
  }

  /**
   * Removes the selected member from the team.
   */
  removeMembers() {
    this.teamService.removeMembers();
  }

  /**
   * Dynamically creates the add team member component, which will be housed in the template with the id of 'add_team_member_container'.
   */
  createAddMemberComponent() {
    this.add_team_member_container.clear();
    const factory = this.resolver.resolveComponentFactory(AddTeamMemberComponent);
    this.teamService.ref = this.add_team_member_container.createComponent(factory);
  }

  /**
   * Passes on the request to save a given team to the team service.
   *
   * @param team The team to be saved.
   */
  save(team: Team) {
    team.teamName = (<HTMLInputElement>document.getElementById("team_name")).value;

    let leadText = (<HTMLInputElement>document.getElementById("selected_team_lead")).value;

    if(leadText == undefined){
      team.leadId = -1;
    }else{
      team.leadId = Number(leadText);
    }
    
    this.teamService.save(team).then();
  }

  /**
   * Passes on the request to delete a given team to the team service.
   * @param team The team to be deleted.
   */
  delete(team: Team) {
    this.teamService.delete(team);
  }

  /**
   * Passes on the request to cancel changes made to the given team to the team service.
   * @param team The teams whose changes are to be canceled.
   */
  cancel(team: Team): void {
    this.teamService.cancel(team);
  }
}
