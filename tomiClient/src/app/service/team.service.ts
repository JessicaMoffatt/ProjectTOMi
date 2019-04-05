import {Injectable} from "@angular/core";
import {BehaviorSubject, Observable} from "rxjs";
import {Team} from "../model/team";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {MatSnackBar} from "@angular/material";
import {map} from "rxjs/operators";
import {teamUrl} from "../configuration/domainConfiguration";
import {UserAccount} from "../model/userAccount";
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
 * @author Iliya Kiritchkov
 * @author Karol Talbot
 * @version 2.0
 */
@Injectable({
  providedIn: 'root'
})
export class TeamService {

  /** The list of all active Teams. */
  private teamSubjectList: BehaviorSubject<Array<Team>> = new BehaviorSubject<Array<Team>>([]);

  public constructor(private http: HttpClient, public snackBar: MatSnackBar, private signInService:SignInService) {

  }

  /**
   * Gets the list of all active teams and populates them into the teamSubjectList.
   */
  public initializeTeams() {
    this.requestAllTeams().forEach(teams => {
      this.teamSubjectList = new BehaviorSubject<Array<Team>>(teams);
      this.sortTeams();
    }).catch((error: any) => {
      console.log("Team error " + error);
    });
  }

  /**
   * Sorts the Teams in the teamSubjectList by ascending name.
   */
  sortTeams() {
    this.teamSubjectList.getValue().sort((team1, team2) => {
      let name1 = team1.teamName.toLowerCase();
      let name2 = team2.teamName.toLowerCase();
      if (name1 > name2) {
        return 1;
      }
      if (name1 < name2) {
        return -1;
      }
      return 0;
    });
  }

  /**
   * Sends a GET message to the server to retrieve all active Teams.
   */
  public requestAllTeams() {
    let obsTeams: Observable<Array<Team>>;
    obsTeams = this.http.get(`${teamUrl}`)
      .pipe(map((data: any) => {
        return data._embedded.teams as Team[];
      }));
    return obsTeams;
  }

  /**
   * Returns teamSubjectList.
   */
  public getTeamSubjectList(): BehaviorSubject<Array<Team>> {
    return this.teamSubjectList;
  }

  /**
   * Saves the specified Team. If the Team is new (id = -1), an HTTP POST is performed,
   * else an HTTP PUT is performed to update the existing Team.
   *
   * @param team The Team to be created/updated.
   */
  public async save(team: Team) {
    let tempTeam: Team = null;
    if (team.id === -1) {
      await this.http.post<Team>(teamUrl, JSON.stringify(team), httpOptions).toPromise().then(response => {
        tempTeam = response;
        return response;
      }).catch((error: any) => {

      });
    } else {
      const url = team._links["update"];
      await this.http.put<Team>(url["href"], JSON.stringify(team), httpOptions).toPromise().then((response) => {
        this.requestAllTeams();

        tempTeam = response;
        return response;
      }).catch((error: Error) => {

      });
    }
    this.signInService.getNavBarList();
    return tempTeam;
  }

  /**
   * Sends a GET message to the server to retrieve all members who aren't on this Team, as well as not a team lead of any other teams.
   * @param id The ID of the Team to be omitted from the selection of UserAccounts.
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
   * Sends a GET message to the server to retrieve all UserAccounts on the Team with the specified ID.
   * @param team The ID of the Team whose members are to be gotten.
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
   * Logically deletes the selected Team (sets their active status to false.)
   *
   * @param team The Team to be deleted.
   */
  async delete(team: Team) {
    const url = team._links["delete"];

    await this.http.delete(url["href"], httpOptions).toPromise().then((response) => {
      this.requestAllTeams();
      return response;
    }).catch((error: Error) => {

    });
  }

  /**
   * Sends a GET message to the server to retrieve the Team by their ID.
   * @param id The id of the team to get.
   */
  getTeamById(id: number): Observable<Team> {
    return this.http.get(`${teamUrl}/${id}`)
      .pipe(map((data: any) => {
        return data as Team;
      }));
  }
}
