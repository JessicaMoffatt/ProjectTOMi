import {Injectable} from "@angular/core";
import {BehaviorSubject, Observable} from "rxjs";
import {Team} from "../model/team";
import {HttpClient} from "@angular/common/http";
import {MatSnackBar} from "@angular/material";
import {map} from "rxjs/operators";
import {teamUrl} from "../configuration/domainConfiguration";

/**
 * TeamService is used to control the flow of data regarding teams to/from the view.
 *
 * @author Jessica Moffatt, Iliya Kiritchkov, and Karol Talbot
 * @version 2.0
 */
@Injectable({
  providedIn: 'root'
})
export class TeamService2 {
  private teamSubjectList: BehaviorSubject<Array<Team>> = new BehaviorSubject<Array<Team>>([]);


  public constructor(private http: HttpClient, public snackBar: MatSnackBar) {

  }

  /*
 * Loads a list of teams retrieved from the back end into a BehaviorSubject object that can be used to retrieve the Teams.
 */
  public initializeTeams() {
    this.requestAllTeams().forEach(teams => {
      this.teamSubjectList = new BehaviorSubject<Array<Team>>(teams);
    }).catch((error: any) => {
      console.log("Team error " + error);
    });
  }

  requestAllTeams() {
    let obsTeams: Observable<Array<Team>>;
    obsTeams = this.http.get(`${teamUrl}`).pipe(map((response: Response) => response))
      .pipe(map((data: any) => {
        return data._embedded.teams as Team[];
      }));
    return obsTeams;
  }

  public getTeamSubjectList():BehaviorSubject<Array<Team>>{
    return this.teamSubjectList;
  }
}
