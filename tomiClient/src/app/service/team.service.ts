import {ComponentRef, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, JsonpClientBackend} from "@angular/common/http";
import {Team} from "../model/team";
import {BehaviorSubject, Observable} from "rxjs";
import {map} from "rxjs/operators";
import {UserAccount} from "../model/userAccount";
import {TeamSidebarService} from "./team-sidebar.service";
import {UserAccountService} from "./user-account.service";
import {teamUrl} from "../configuration/domainConfiguration";
import{userAccountUrl} from "../configuration/domainConfiguration";
import {MatSnackBar} from "@angular/material";

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

  /** List of all the team members of the selectedExpense team.*/
  teamMembers: UserAccount[] = [];
  teamSubject: BehaviorSubject<Array<Team>> = new BehaviorSubject<Array<Team>>([]);

  teamsObservable: Team[] = [];

  /** List of all the team members not currently on any teams.*/
  allFreeMembers: UserAccount[] = [];

  /** The members selectedExpense from the list of team members.*/
  private selectedMembers: UserAccount[];

  /** Used to reference the add team member component created by clicking the Add Member button.*/
  ref: ComponentRef<any>;

  constructor(private http: HttpClient, private teamSideBarService: TeamSidebarService, private userAccountService:UserAccountService, private snackBar: MatSnackBar) {
    this.refreshTeams();
  }

  /**
   * Gets a List of all Teams from the server.
   */
  GETAllTeams() {
    return this.http.get(teamUrl)
      .pipe(map((data: any) => {
        return data._embedded.teams as Team[];
      }));
  }

  /**
   * Refresh the list of teamSubject to keep up-to-date with the server.
   */
  refreshTeams() {
    let freshTeams: Team[];

    this.GETAllTeams().forEach(teams => {
      freshTeams = teams;

      //Replace all users with fresh user data
      freshTeams.forEach(freshTeam => {
        let index = this.teamSubject.getValue().findIndex((staleTeam) => {
          return (staleTeam.id === freshTeam.id);
        });

        // If the id didn't match any of the existing ids then add it to the list.
        if (index === -1) {
          this.teamSubject.getValue().push(freshTeam);

          // id was found and this Team will be replaced with fresh data.
        } else {
          this.teamSubject.getValue().splice(index, 1, freshTeam);
        }
      });

      // Check for any deleted Teams
      this.teamSubject.getValue().forEach(oldTeam => {
        let index = freshTeams.findIndex( newTeam => {
          return (newTeam.id === oldTeam.id);
        });

        if (index === -1) {
          let indexToBeRemoved = this.teamSubject.getValue().findIndex((teamToBeRemoved) => {
            return (teamToBeRemoved.id === oldTeam.id);
          });

          this.teamSubject.getValue().splice(indexToBeRemoved, 1);
        }
      });
    }).then(() => {
      this.sortTeams();
    }).catch((error: any) => {
      let getTeamErrorMessage = 'Something went wrong when updating the list of Teams.';
      this.snackBar.open(getTeamErrorMessage, null, {duration: 5000, politeness: 'assertive', panelClass: 'snackbar-fail', horizontalPosition: 'center'});
    });
  }

  /**
   * Sorts all teams in the teamSubject list by ascending team name.
   */
  sortTeams() {
    this.teamSubject.getValue().sort((team1, team2) => {
      let teamName1 = team1.teamName.toLowerCase();
      let teamName2 = team2.teamName.toLowerCase();
      if (teamName1 > teamName2) {return 1; }
      if (teamName1 < teamName2) {return -1; }
      return 0;
    });
  }

  /**
   * Populates teamMembers with the members of the selectedProject team.
   * @param team The selectedProject team.
   */
  populateTeamMembers(team:Team){
    this.getTeamMembers(team).subscribe((data: Array<UserAccount>) => {
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
  getAllFreeMembers(): Observable<Array<UserAccount>> {
    return this.http.get(`${teamUrl}/unassigned`)
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
  getTeamMembers(team: Team): Observable<Array<UserAccount>> {
    let url = team._links["getAccounts"];
    return this.http.get(url["href"])
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
    return this.http.get(`${userAccountUrl}/${id}`)
      .pipe(map((data: any) => {
        return data as UserAccount;
      }));
  }

  async save (team: Team) {
    if (team.id === -1) {
      let savedTeam: Team = null;
      await this.http.post<Team>(`${teamUrl}`, JSON.stringify(team), httpOptions).toPromise().then(response => {
        this.refreshTeams();
        savedTeam = response;
        return response;
      }).catch((error: Error) => {
        let addTeamErrorMessage = 'Something went wrong when adding ' + team.teamName + '.';
        this.snackBar.open(addTeamErrorMessage, null, {duration: 5000, politeness: 'assertive', panelClass: 'snackbar-fail', horizontalPosition: 'center'});
        throw error;
      });
      return savedTeam;
    } else {
      const url = team._links["self"];
      await this.http.put<Team>(url["href"], JSON.stringify(team), httpOptions).toPromise().then(response => {
        this.refreshTeams();
      }).catch( (error: any) => {
        let editTeamErrorMessage = 'Something went wrong when updating ' + team.teamName + '.';
        this.snackBar.open(editTeamErrorMessage, null, {duration: 5000, politeness: 'assertive', panelClass: 'snackbar-fail', horizontalPosition: 'center'});
      });
    }
  }

  /**
   * Cancels any changes made to the team name or the team lead.
   * @param team The selectedExpense team.
   */
  cancel(team: Team): void {
    this.teamSideBarService.getTeamById(team.id).subscribe((data)=>{
      this.teamSideBarService.selectedTeam = data;
    });
  }

  /**
   * Logically deletes the selectedExpense team (sets their active status to false.)
   *
   * @param team The team to be deleted.
   */
  delete(team: Team) {
    const url = team._links["self"];
    this.http.delete(url["href"], httpOptions).toPromise().then( response => {
      this.refreshTeams();
    }).catch(error => {
      let deleteTeamErrorMessage = 'Something went wrong when deleting ' + team.teamName + '.';
      this.snackBar.open(deleteTeamErrorMessage, null, {duration: 5000, politeness: 'assertive', panelClass: 'snackbar-fail', horizontalPosition: 'center'});
    });
  }
}
