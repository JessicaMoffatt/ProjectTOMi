import { Injectable } from '@angular/core';
import {UserAccount} from "../model/userAccount";
import {Team} from "../model/team";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";
import {HttpClient} from "@angular/common/http";
import {TeamService} from "./team.service";
import {Timesheet} from "../model/timesheet";
import {TimesheetService} from "./timesheet.service";
import {Entry} from "../model/entry";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class TeamMemberTimesheetService {

  teamMembers: UserAccount[];
  /** The team member selected in the sidebar.*/
  selectedMember: UserAccount;

  //TODO, dont hardcode, should come from header
 teamid: number = 1;

  entries: Entry[] = [];

  tally: number = 0;

 //TODO, get this from the user object from header
  private userUrl = `http://localhost:8080/user_accounts/`;

  constructor(private http: HttpClient, private router: Router, private teamService:TeamService, public timesheetService: TimesheetService) {

  }

  getAllTeamMembers(): Observable<Array<UserAccount>> {
    return this.teamService.getTeamMembers(this.teamid);
  }

  //TODO, replace with Iliya's version in user_account_service
  getMemberById(id: number): Observable<UserAccount> {
    return this.http.get(`${this.userUrl}/${id}`).pipe(map((response: Response) => response))
      .pipe(map((data: any) => {
        return data as UserAccount;
      }));
  }

  /**
   * Reassigns the list of team members to reflect changes made to the database.
   */
  reloadTeamMembers() {
    this.getAllTeamMembers().subscribe((data: Array<UserAccount>) => {
      this.teamMembers = data;
    });
  }

  displayTimesheet(){
    this.populateTimesheets().then((value) => {
      let timesheet = value as Timesheet;
      this.getEntries(timesheet.id);
    });
  }

  private async populateTimesheets() {
    let promise = new Promise((resolve, reject) => {
      resolve(this.timesheetService.populateTimesheets(this.selectedMember.id))
    });

    return await promise;
  }

  private getEntries(id: number) {
    this.timesheetService.getEntries(id).subscribe((data) => {
      this.entries = data;
      this.updateTally();
    });
  }

  public updateTally(): void {
    let hours: number = 0;
    this.entries.forEach(function (entry) {
      hours += +entry.mondayHours + +entry.tuesdayHours + +entry.wednesdayHours + +entry.thursdayHours + +entry.fridayHours + +entry.saturdayHours + +entry.sundayHours;
    });

    this.tally = hours;
  }

  displayPrevTimesheet() {
    let currentIndex = this.timesheetService.getCurrentTimesheetIndex();

    if (currentIndex < this.timesheetService.timesheets.length -1) {
      let newIndex: number = currentIndex + 1;
      this.timesheetService.setCurrentTimesheetIndex(newIndex).then(() => {
          this.navigateToTimesheet();
        }
      );
    }
  }

  displayNextTimesheet(){
    let currentIndex = this.timesheetService.getCurrentTimesheetIndex();

    if (currentIndex > 0) {
      let newIndex: number = currentIndex - 1;
      this.timesheetService.setCurrentTimesheetIndex(newIndex).then(() => {
          this.navigateToTimesheet();
        }
      );
    }
  }

  navigateToTimesheet() {
    this.router.navigateByUrl('/', {skipLocationChange: true}).finally(() =>
      this.router.navigate(["/timesheetPanel"]));
  }
}
