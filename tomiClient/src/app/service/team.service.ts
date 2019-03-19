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
 * @author Jessica Moffatt, Iliya Kiritchkov
 * @version 2.0
 */
@Injectable({
  providedIn: 'root'
})
export class TeamService {

  /** The link used to get,post, and delete teams. */
  private teamUrl = `http://localhost:8080/teams`;
  /** The link used to get,post, and delete user accounts. */
  private userUrl = `http://localhost:8080/user_accounts`;

  /** List of all the team members of the selectedProject team.*/
  teamMembers: UserAccount[] = [];

  teamsObservable: Team[] = [];

  /** List of all the team members not currently on any teams.*/
  allFreeMembers: UserAccount[] = [];
  //
  // /** List of all the active user accounts that aren't already a part of the selectedProject team,
  //  * as well as not a team lead of any other teams.
  //  */
  // allOutsideMembers: UserAccount[] = [];
  /** The members selectedProject from the list of team members.*/
  private selectedMembers: UserAccount[];

  /** Used to reference the add team member component created by clicking the Add Member button.*/
  ref: ComponentRef<any>;

  constructor(private http: HttpClient, private teamSideBarService: TeamSidebarService, private userAccountService:UserAccountService) {
    this.refreshTeams();
  }

  /**
   * Gets a List of all Teams from the server.
   */
  GETAllTeams() {
    return this.http.get(this.teamUrl)
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
   * Populates teamMembers with the members of the selectedProject team.
   * @param team The selectedProject team.
   */
  populateTeamMembers(team:Team){
    this.getTeamMembers(team.id).subscribe((data: Array<UserAccount>) => {
      this.teamMembers = data;
    });
  }

  /**
   * Sets selectedMember to the specified user account.
   * @param members The user accounts to set selectedMembers to.
   */
  setSelectMembers(members:UserAccount[]) {
    this.selectedMembers = members as UserAccount[];
  }

  /**
   * Removes a member from the selectedProject team.
   */
  async removeMembers() {
    if(this.selectedMembers.length > 0){
      for(let m of this.selectedMembers){
        let index = this.teamMembers.findIndex((element) => {
          return (element.id == m.id);
        });

        this.teamMembers.splice(index, 1);

        m.teamId = -1;
        await this.userAccountService.save(m).then(()=>{
          if(this.teamSideBarService.selectedTeam.leadId === m.id){
            this.teamSideBarService.selectedTeam.leadId = -1;
            this.save(this.teamSideBarService.selectedTeam).then();
          }
        });
      }

      this.selectedMembers = [];
    }
  }

  /**
   * Gets all members who aren't on the team, as well as not a team lead of any other teams.
   * @param id The ID of the team to be omitted from the selection of user accounts.
   */
  getAllOutsideMembers(id: number): Observable<Array<UserAccount>> {
    return this.http.get(`${this.teamUrl}/${id}/available`)
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
    return this.http.get(`${this.teamUrl}/unassigned`)
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
    return this.http.get(`${this.teamUrl}/${id}/user_accounts`)
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
    return this.http.get(`${this.userUrl}/${id}`)
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
   * @param team The selectedProject team.
   */
  cancel(team: Team): void {
    this.teamSideBarService.getTeamById(team.id).subscribe((data)=>{
      this.teamSideBarService.selectedTeam = data;
    });
  }

  //TODO add error handling!!
  /**
   * Logically deletes the selectedProject team (sets their active status to false.)
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
}
