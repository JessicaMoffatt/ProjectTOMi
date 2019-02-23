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
import {UserAccountService} from "./user-account.service";

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

  constructor(private http: HttpClient, private router: Router, private userAccountService:UserAccountService, private teamService:TeamService, public timesheetService: TimesheetService) {

  }

  getAllTeamMembers(): Observable<Array<UserAccount>> {
    return this.teamService.getTeamMembers(this.teamid);
  }

  getMemberById(id: number): Observable<UserAccount> {
    return this.userAccountService.getUserById(id);
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
      this.populateEntries(timesheet.id);
    });
  }

  private async populateTimesheets() {
    let promise = new Promise((resolve, reject) => {
      resolve(this.timesheetService.populateTimesheets(this.selectedMember.id))
    });

    return await promise;
  }

  private populateEntries(id: number) {
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
        this.displayTimesheet();
        }
      );
    }
  }

  displayNextTimesheet(){
    let currentIndex = this.timesheetService.getCurrentTimesheetIndex();

    if (currentIndex > 0) {
      let newIndex: number = currentIndex - 1;
      this.timesheetService.setCurrentTimesheetIndex(newIndex).then(() => {
          this.displayTimesheet();
        }
      );
    }
  }

  displaySpecifiedTimesheet(index:number){
    let currentIndex = this.timesheetService.getCurrentTimesheetIndex();
    let newIndex: number = currentIndex + index;

    if (newIndex < this.timesheetService.timesheets.length) {
      this.timesheetService.setCurrentTimesheetIndex(newIndex).then(() => {
          this.displayTimesheet();
        }
      );
    }
  }
}
