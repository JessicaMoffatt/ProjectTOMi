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

/**
 * TeamMemberTimesheetService is used to control the flow of data regarding timesheets to/from the view.
 *
 * @author Jessica Moffatt
 * @version 1.0
 */
@Injectable({
  providedIn: 'root'
})
export class TeamMemberTimesheetService {

  /** The list of team members for this team lead's team.*/
  teamMembers: UserAccount[];
  /** The team member selectedProject in the sidebar.*/
  selectedMember: UserAccount;



  //TODO, dont hardcode, should come from header
 teamid: number = 1;

 /** The list of entries for the displaying timesheet*/
  entries: Entry[] = [];

  /** The total number of hours worked for the displaying timesheet*/
  tally: number = 0;

  constructor(private http: HttpClient, private router: Router, private userAccountService:UserAccountService, private teamService:TeamService, public timesheetService: TimesheetService) {

  }



  /**
   * Gets all the team members for this team lead's team.
   */
  getAllTeamMembers(): Observable<Array<UserAccount>> {
    return this.teamService.getTeamMembers(this.teamid);
  }

  /**
   * Gets the team member with the specified ID.
   * @param id The ID of the team member to get.
   */
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

  /**
   * Displays the most recent timesheet.
   */
  displayTimesheet(){
    this.populateTimesheets().then((value) => {
      let timesheet = value as Timesheet;
      this.populateEntries(timesheet.id);
      console.log("display timesheet");
      console.log(this.timesheetService.currentDate);
      this.timesheetService.setCurrentDate();
    });
  }

  /**
   * Populates the list of timesheets in timesheet service.
   */
  private async populateTimesheets() {
    let promise = new Promise((resolve, reject) => {
      resolve(this.timesheetService.populateTimesheets(this.selectedMember.id));
    });

    return await promise;
  }

  /**
   * Populates the list of entries for the specified timesheet.
   * @param id The ID of the timesheet to display entries for.
   */
  private populateEntries(id: number) {
    this.timesheetService.getEntries(id).subscribe((data) => {
      this.entries = data;
      this.updateTally();
    });
  }

  /**
   * Updates the tally.
   */
  public updateTally(): void {
    let hours: number = 0;
    this.entries.forEach(function (entry) {
      hours += +entry.mondayHours + +entry.tuesdayHours + +entry.wednesdayHours + +entry.thursdayHours + +entry.fridayHours + +entry.saturdayHours + +entry.sundayHours;
    });

    this.tally = hours;
  }

  /**
   * Displays the previous timesheet.
   */
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

  /**
   * Displays the next timesheet.
   */
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

  /**
   * Displays the specified timesheet.
   * @param index The index of the timesheet to display.
   */
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
