import {ComponentRef, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, JsonpClientBackend} from "@angular/common/http";
import {Team} from "../model/team";
import {BehaviorSubject, Observable} from "rxjs";
import {map} from "rxjs/operators";
import {UserAccount} from "../model/userAccount";
import {TeamSidebarService} from "./team-sidebar.service";
import {UserAccountService} from "./user-account.service";
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

  /** The link used to get,post, and delete teams. */
  private teamUrl = `http://localhost:8080/teams`;
  /** The link used to get,post, and delete user accounts. */
  private userUrl = `http://localhost:8080/user_accounts`;

  /** List of all the team members of the selected team.*/
  teamMembers: UserAccount[] = [];
  teamSubject: BehaviorSubject<Array<Team>> = new BehaviorSubject<Array<Team>>([]);

  teamsObservable: Team[] = [];

  /** List of all the team members not currently on any teams.*/
  allFreeMembers: UserAccount[] = [];
  //
  // /** List of all the active user accounts that aren't already a part of the selected team,
  //  * as well as not a team lead of any other teams.
  //  */
  // allOutsideMembers: UserAccount[] = [];
  /** The members selected from the list of team members.*/
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
    return this.http.get(this.teamUrl)
      .pipe(map((data: any) => {
        return data._embedded.teams as Team[];
      }));
  }

  // refreshTeams() {
  //   this.GETAllTeams().subscribe((data)=>{
  //     this.teamsObservable = data;
  //   });
  // }

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
      let getTeamErrorMessage = 'Something went wrong when updating the list of Teams. Please contact your system administrator.';
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
   * Populates teamMembers with the members of the selected team.
   * @param team The selected team.
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
   * Removes a member from the selected team.
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
  //
  // async save (team: Team) {
  //   if (team.id === -1) {
  //     let savedTeam: Team = null;
  //     await this.http.post<Team>(this.teamUrl, JSON.stringify(team), httpOptions).toPromise().then(response => {
  //       this.refreshTeams();
  //       savedTeam = response;
  //       return response;
  //       //let addTeamSuccessMessage = team.teamName + ' added successfully.';
  //       //this.snackBar.open(addTeamSuccessMessage, null, {duration: 4000, politeness: 'assertive', panelClass: 'snackbar-success', horizontalPosition: 'center'});
  //     }).catch((error: Error) => {
  //       throw error;
  //       // let addTeamErrorMessage = 'Something went wrong when adding ' + team.teamName + '. Please contact your system administrator.';
  //       // this.snackBar.open(addTeamErrorMessage, null, {duration: 5000, politeness: 'assertive', panelClass: 'snackbar-fail', horizontalPosition: 'center'});
  //     });
  //     return savedTeam;
  //   } else {
  //     const url = team._links["self"];
  //     await this.http.put<Team>(url["href"], JSON.stringify(team), httpOptions).toPromise().then(response => {
  //       this.refreshTeams();
  //       let editTeamSuccessMessage = team.teamName + ' updated successfully.';
  //       this.snackBar.open(editTeamSuccessMessage, null, {duration: 4000, politeness: 'assertive', panelClass: 'snackbar-success', horizontalPosition: 'center'});
  //     }).catch( (error: any) => {
  //       let editTeamErrorMessage = 'Something went wrong when updating ' + team.teamName + '. Please contact your system administrator.';
  //       this.snackBar.open(editTeamErrorMessage, null, {duration: 5000, politeness: 'assertive', panelClass: 'snackbar-fail', horizontalPosition: 'center'});
  //     });
  //   }
  // }

  /**
   * Cancels any changes made to the team name or the team lead.
   * @param team The selected team.
   */
  cancel(team: Team): void {
    this.teamSideBarService.getTeamById(team.id).subscribe((data)=>{
      this.teamSideBarService.selectedTeam = data;
    });
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
}
