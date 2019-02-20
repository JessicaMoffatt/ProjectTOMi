import {ComponentRef, Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {Team} from "../model/team";
import {map} from "rxjs/operators";
import {HttpClient} from "@angular/common/http";




/**
 * TeamSidebarService is used to control the flow of data regarding teams to/from the view.
 *
 * @author Jessica Moffatt
 * @version 1.0
 */
@Injectable({
  providedIn: 'root'
})
export class TeamSidebarService {

  /** The link used to get,post, and delete teams. */
  private teamUrl = `http://localhost:8080/teams/`;

  /** Used to reference the add team component created by clicking the Add Team button.*/
  ref: ComponentRef<any>;

  /** The team selected in the sidebar.*/
  selectedTeam: Team;

  /** List of all the teams.*/
  teams: Team[];

  constructor(private http: HttpClient) {
  }




  /**
   * Gets a list of all the teams.
   */
  getAllTeams(): Observable<Array<Team>> {
    return this.http.get(this.teamUrl).pipe(map((response: Response) => response))
      .pipe(map((data: any) => {
        return data._embedded.teams as Team[];
      }));
  }

  /**
   * Gets a team with the specified ID.
   * @param id The id of the team to get.
   */
  getTeamById(id: number): Observable<Team> {
    return this.http.get(`${this.teamUrl}/${id}`).pipe(map((response: Response) => response))
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

  /**
   * Destroys the dynamically created add team component.
   */
  destroyAddTeamComponent() {
    this.ref.destroy();
  }
}
