import {Component, OnInit, ViewChild} from '@angular/core';
import {Team} from "../../../model/team";
import {FormControl, Validators} from "@angular/forms";
import {TeamService2} from "../../../service/team2.service";
import {TeamService} from "../../../service/team.service";
import {UserAccountService} from "../../../service/user-account.service";
import {UserAccount} from "../../../model/userAccount";
import {map} from "rxjs/operators";
import {BehaviorSubject, Observable} from "rxjs";
import {Task} from "../../../model/task";

@Component({
  selector: 'app-manage-teams-panel',
  templateUrl: './manage-teams-panel.component.html',
  styleUrls: ['./manage-teams-panel.component.scss']
})
export class ManageTeamsPanelComponent implements OnInit {
  private selectedTeam: Team = null;
  private selectedTeamMembers: BehaviorSubject<Array<UserAccount>> = new BehaviorSubject([]);
  private availableMembers: BehaviorSubject<Array<UserAccount>> = new BehaviorSubject([]);

  /** Validations for the name. */
  teamNameControl = new FormControl('', [
    Validators.required
  ]);

  /** The input field for the Team's name.*/
  @ViewChild('editTeamName') editTeamName;
  @ViewChild('sideBar') sideBar;

  constructor(private teamserv2: TeamService2, public teamService: TeamService, public userAccountService: UserAccountService) {
  }

  ngOnInit() {
  }

  /**
   * Initialize the value inputs on the template. This fixes issues caused by the Validators.required when an input is pristine.
   */
  setValuesOnOpen() {
    this.teamNameControl.setValue(this.selectedTeam.teamName);
  }

  public isTeamSelected(): boolean {
    return this.selectedTeam != null;
  }

  public setSelectedTeam(team: Team): void {
    this.selectedTeam = team;
    this.setValuesOnOpen();
    this.getTeamMembers();
  }

  public getSelectedTeam(): Team {
    return this.selectedTeam;
  }

  public openDialog() {
    alert("hello");
  }

  public getTeamMembers() {
    this.teamService.getTeamMembers(this.selectedTeam).forEach(userAccount => {
      this.selectedTeamMembers = new BehaviorSubject<Array<UserAccount>>(userAccount);
    }).catch((error: any) => {
      console.log("Team Member error " + error);
    });
    this.teamService.getAllFreeMembers().forEach(userAccount => {
      this.availableMembers = new BehaviorSubject<Array<UserAccount>>(userAccount);
    }).catch((error: any) => {
      console.log("Team Member error " + error);
    });
    ;
  }

  public getSelectedTeamMembers() {
    return this.selectedTeamMembers;
  }

  public getAvailableMembers() {
    return this.availableMembers;
  }

  public drop(event: Event, list: String) {
    let member = event['item'].data as UserAccount;
    if (event['container'] != event['previousContainer']) {
      if ("available" == list) {
        this.remove(member);
      } else {
        this.add(member);
      }
    }
  }

  public cancel() {
    this.sideBar.unselect(this.selectedTeam.id);
    this.selectedTeam = null;
  }

  private remove(member: UserAccount) {
      let memloc = this.selectedTeamMembers.getValue().lastIndexOf(member);
      this.selectedTeamMembers.getValue().splice(memloc, 1);
      this.availableMembers.getValue().push(member);
  }

  private add(member: UserAccount) {
    let memloc = this.availableMembers.getValue().lastIndexOf(member);
    this.availableMembers.getValue().splice(memloc, 1);
    this.selectedTeamMembers.getValue().push(member);
  }

  public move(member:UserAccount, list:string){
    if ("available" != list) {
      this.remove(member);
    }else{
      this.add(member);
    }
  }
}
