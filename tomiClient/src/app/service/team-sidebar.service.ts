import {ComponentRef, Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {Team} from "../model/team";
import {map} from "rxjs/operators";
import {HttpClient} from "@angular/common/http";
import {teamUrl} from "../configuration/domainConfiguration";

/**
 * TeamSidebarService is used to control the flow of data regarding teams to/from the view.
 *
 * @author Jessica Moffatt
 * @version 2.0
 */
@Injectable({
  providedIn: 'root'
})
export class TeamSidebarService {

  /** The team selected in the sidebar.*/
  selectedTeam: Team;

  /** List of all the teams.*/
  teams: Team[] = [];

  constructor(private http: HttpClient) {
  }

  /**
   * Gets a list of all the teams.
   */
  getAllTeams(): Observable<Array<Team>> {
    return this.http.get(teamUrl)
      .pipe(map((data: any) => {
          return data._embedded.teams as Team[];
      }));
  }

  //TODO account for 400 error
  /**
   * Gets a team with the specified ID.
   * @param id The id of the team to get.
   */
  getTeamById(id: number): Observable<Team> {
    return this.http.get(`${teamUrl}${id}`)
      .pipe(map((data: any) => {
          return data as Team;
      }));
  }

  /**
   * Reassigns the list of teams to reflect changes made to the database.
   */
  reloadTeams() {
    this.getAllTeams().subscribe((data: Array<Team>) => {
      this.teams = data;
    });
  }
}
