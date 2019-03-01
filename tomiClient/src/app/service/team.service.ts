import {ComponentRef, Injectable, NgModule} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Team} from "../model/team";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";
import {UserAccount} from "../model/userAccount";
import {TeamSidebarService} from "./team-sidebar.service";
import {UserAccountService} from "./user-account.service";
import {SignInService} from "./sign-in.service";

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

/**
 * TeamService is used to control the flow of data regarding teams to/from the view.
 *
 * @author Jessica Moffatt
 * @version 1.0
 */
@Injectable({
  providedIn: 'root'
})
export class TeamService {

  /** The link used to get,post, and delete teams. */
  private teamUrl = `http://localhost:8080/teams`;
  /** The link used to get,post, and delete user accounts. */
  private userUrl = `http://localhost:8080/user_accounts`;

  /** List of all the team members of the selected team.*/
  teamMembers: UserAccount[] = [];

  teamsObservable: Team[];

  /** List of all the team members not currently on any teams.*/
  allFreeMembers: UserAccount[] = [];

  /** List of all the active user accounts that aren't already appart of the selected team,
   * as well as not a team lead of any other teams.
   */
  allOutsideMembers: UserAccount[] = [];
  /** The member selected from the list of team members.*/
  private selectedMember: UserAccount;

  /** Used to reference the add team member component created by clicking the Add Member button.*/
  ref: ComponentRef<any>;

  constructor(private http: HttpClient, private teamSideBarService: TeamSidebarService) {
    this.refreshTeams();
  }

  /**
   * Gets a List of all Teams from the server.
   */
  GETAllTeams() {
    return this.http.get(this.teamUrl).pipe(map((response:Response) => response))
      .pipe(map((data: any) => {
        return data._embedded.teams as Team[];
      }));
  }

  refreshTeams() {
    this.GETAllTeams().subscribe((data)=>{
      this.teamsObservable = data;
    });
  }

  /**
   * Sets selectedMember to the specified user account.
   * @param account The user account to set selectedMember to.
   */
  setSelectMember(account: UserAccount) {
    this.selectedMember = account;
  }

  /**
   * Removes a member from the selected team.
   */
  removeMember() {
    let index = this.teamMembers.findIndex((element) => {
      return (element.id == this.selectedMember.id);
    });

    this.teamMembers.splice(index, 1);

    this.selectedMember.teamId = -1;

    // TODO Remove this comment and allow this code
    // this.userAccountService.save(this.selectedMember);

    if(this.teamSideBarService.selectedTeam.leadId === this.selectedMember.id){
      this.teamSideBarService.selectedTeam.leadId = -1;
      this.save(this.teamSideBarService.selectedTeam).then();
    }

    this.selectedMember = null;
  }

  /**
   * Gets all members who aren't on the team, as well as not a team lead of any other teams.
   * @param id The ID of the team to be omitted from the selection of user accounts.
   */
  getAllOutsideMembers(id: number): Observable<Array<UserAccount>> {
    return this.http.get(`${this.teamUrl}/${id}/available`).pipe(map((response: Response) => response))
      .pipe(map((data: any) => {
        if (data._embedded !== undefined) {
          return data._embedded.userAccounts as UserAccount[];
        } else {
          return [];
        }
      }));
  }

  /**
   * Gets all members who aren't on the team, as well as not a team lead of any other teams.
   * @param id The ID of the team to be omitted from the selection of user accounts.
   */
  getAllFreeMembers(): Observable<Array<UserAccount>> {
    return this.http.get(`${this.teamUrl}/unassigned`).pipe(map((response: Response) => response))
      .pipe(map((data: any) => {
        if (data._embedded !== undefined) {
          return data._embedded.userAccounts as UserAccount[];
        } else {
          return [];
        }
      }));
  }

  /**
   * Gets all user accounts on the team with the specified ID.
   * @param id The ID of the team whose members are to be gotten.
   */
  getTeamMembers(id: number): Observable<Array<UserAccount>> {
    return this.http.get(`${this.teamUrl}/${id}/user_accounts`).pipe(map((response: Response) => response))
      .pipe(map((data: any) => {
        if (data._embedded !== undefined) {
          return data._embedded.userAccounts as UserAccount[];
        } else {
          return [];
        }
      }));
  }

  /**
   * Gets a user account with the specified ID.
   *
   * @param id The ID of the user account to get.
   */
  getTeamMemberById(id: number): Observable<UserAccount> {
    return this.http.get(`${this.userUrl}/${id}`).pipe(map((response: Response) => response))
      .pipe(map((data: any) => {
        return data as UserAccount;
      }));
  }

  //TODO add error handling!!
  /**
   * Saves a specified team. If the team is new (ID of -1) an HTTP POST is performed, else a PUT is performed to update the existing team.
   * @param team The team to update/create.
   */
  async save(team: Team) {
    let tempTeam: Team = null;
    if (team.id === -1) {
      await this.http.post<Team>(this.teamUrl, JSON.stringify(team), httpOptions).toPromise().then(response => {
        tempTeam = response;
        return response;
      }).catch((error: any) => {
        //TODO
      });
    } else {
      const url = team._links["update"];
      this.http.put<Team>(url["href"], JSON.stringify(team), httpOptions).toPromise().then((response) => {
        this.teamSideBarService.reloadTeams();

        tempTeam = response;
        return response;
      }).catch((error: any) => {
        //TODO
      });
    }

    return tempTeam;
  }

  /**
   * Cancels any changes made to the team name or the team lead.
   * @param team The selected team.
   */
  cancel(team: Team): void {
    (<HTMLInputElement>document.getElementById("team_name")).value = team.teamName;
    if(team.leadId !== null){
      (<HTMLInputElement>document.getElementById("selected_team_lead")).value = team.leadId.toString();
    }else{
      (<HTMLInputElement>document.getElementById("selected_team_lead")).value = "-1";
    }
  }

  //TODO add error handling!!
  /**
   * Logically deletes the selected team (sets their active status to false.)
   *
   * @param team The team to be deleted.
   */
  delete(team: Team) {
    let index = this.teamSideBarService.teams.findIndex((element) => {
      return (element.id == team.id);
    });

    this.teamSideBarService.teams.splice(index, 1);

    const url = team._links["delete"];

    this.http.delete(url["href"], httpOptions).subscribe((response) => {
      this.teamSideBarService.selectedTeam = null;
      this.teamMembers = [];

      return response as Team;
    });
  }

  /**
   * Destroys the dynamically created add member component.
   */
  destroyAddMemberComponent() {
    this.ref.destroy();
  }
}
