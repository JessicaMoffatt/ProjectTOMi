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
  private teamSubjectList: BehaviorSubject<Array<Team>> = new BehaviorSubject<Array<Team>>([]);


  public constructor(private http: HttpClient, public snackBar: MatSnackBar, private signInService:SignInService) {

  }

  /*
 * Loads a list of teams retrieved from the back end into a BehaviorSubject object that can be used to retrieve the Teams.
 */
  public initializeTeams() {
    this.requestAllTeams().forEach(teams => {
      this.teamSubjectList = new BehaviorSubject<Array<Team>>(teams);
      this.sortTeams();
    }).catch((error: any) => {
      console.log("Team error " + error);
    });
  }

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

  public requestAllTeams() {
    let obsTeams: Observable<Array<Team>>;
    obsTeams = this.http.get(`${teamUrl}`).pipe(map((response: Response) => response))
      .pipe(map((data: any) => {
        return data._embedded.teams as Team[];
      }));
    return obsTeams;
  }

  public getTeamSubjectList(): BehaviorSubject<Array<Team>> {
    return this.teamSubjectList;
  }

  public async save(team: Team) {
    let tempTeam: Team = null;
    if (team.id === -1) {
      await this.http.post<Team>(teamUrl, JSON.stringify(team), httpOptions).toPromise().then(response => {
        tempTeam = response;
        return response;
      }).catch((error: any) => {
        //TODO
      });
    } else {
      const url = team._links["update"];
      await this.http.put<Team>(url["href"], JSON.stringify(team), httpOptions).toPromise().then((response) => {
        this.requestAllTeams();

        tempTeam = response;
        return response;
      }).catch((error: Error) => {
        //TODO
        console.log(error);
      });
    }
    this.signInService.getNavBarList();
    return tempTeam;
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
   * @param team The ID of the team whose members are to be gotten.
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

  //TODO add error handling!!
  /**
   * Logically deletes the selected team (sets their active status to false.)
   *
   * @param team The team to be deleted.
   */
  async delete(team: Team) {
    const url = team._links["delete"];

    await this.http.delete(url["href"], httpOptions).toPromise().then((response) => {
      this.requestAllTeams();

      return response;
    }).catch((error: Error) => {
      //TODO
      console.log(error);
    });
  }

  //TODO account for 400 error
  /**
   * Gets a team with the specified ID.
   * @param id The id of the team to get.
   */
  getTeamById(id: number): Observable<Team> {
    return this.http.get(`${teamUrl}/${id}`)
      .pipe(map((data: any) => {
        return data as Team;
      }));
  }
}
