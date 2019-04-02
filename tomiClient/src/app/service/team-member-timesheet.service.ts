import {Injectable} from '@angular/core';
import {UserAccount} from "../model/userAccount";
import {Observable} from "rxjs";
import {catchError, map} from "rxjs/operators";
import {HttpClient} from "@angular/common/http";
import {TeamService} from "./team.service";
import {Timesheet} from "../model/timesheet";
import {TimesheetService} from "./timesheet.service";
import {Entry} from "../model/entry";
import {Router} from "@angular/router";
import {UserAccountService} from "./user-account.service";
import {ProductivityReportLine} from "../model/productivityReportLine";
import {MatSnackBar} from "@angular/material";
import {SignInService} from "./sign-in.service";
import {Team} from "../model/team";
import {TeamSidebarService} from "./team-sidebar.service";
import {ErrorService} from "./error.service";

/**
 * TeamMemberTimesheetService is used to control the flow of data regarding timesheets to/from the view.
 *
 * @author Jessica Moffatt
 * @version 1.0
 */
@Injectable({
  providedIn: 'root'
})
export class TeamMemberTimesheetService{

  /** The list of team members for this team lead's team.*/
  teamMembers: UserAccount[] = [];

  /** The team member selectedProject in the sidebar.*/
  selectedMember: UserAccount;

  selectedMemberReport: ProductivityReportLine[] = [];
  teamMembersReports: ProductivityReportLine[] = [];

  teamid: number = this.signInService.userAccount.teamId;
  team: Team;
  /** The list of entries for the displaying timesheet*/
  entries: Entry[] = [];

  /** The total number of hours worked for the displaying timesheet*/
  tally: number = 0;

  constructor(private http: HttpClient, private router: Router,
              private userAccountService: UserAccountService, private teamService: TeamService,
              public timesheetService: TimesheetService, public snackBar: MatSnackBar,
              private signInService:SignInService, private teamSidebarService:TeamSidebarService,
              private errorService: ErrorService) {
  }

  /**
   * Gets all the team members for this team lead's team.
   */
  getAllTeamMembers(team:Team): Observable<Array<UserAccount>> {
    return this.teamService.getTeamMembers(team);
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
   * Also repopulates the team member productivity reports.
   */
  reloadTeamMembers() {
    this.teamMembersReports =[];

    if(this.team === null || this.team === undefined){
      this.teamSidebarService.getTeamById(this.teamid).subscribe((data)=>{
        this.team = data;
        this.getAllTeamMembersAndReports(data);
      });
    }else{
      this.getAllTeamMembersAndReports(this.team);
    }
  }

  getAllTeamMembersAndReports(team:Team){
    this.getAllTeamMembers(team).subscribe((data: Array<UserAccount>) => {
      this.teamMembers = data;
      for (let i = 0; i < this.teamMembers.length; i++) {
        this.getProductivityReportByMember(this.teamMembers[i])
          .subscribe((data: ProductivityReportLine[]) => {
            this.teamMembersReports = this.teamMembersReports.concat(data);
            this.teamMembersReports.sort(ProductivityReportLine.compareDate);
            this.teamMembersReports.sort(ProductivityReportLine.compareUser);
          }, () =>
            this.errorService.displayErrorMessage(
              'Something went wrong when loading team member productivity reports.')
          );
      }
    }, () => {
      this.errorService.displayErrorMessage('Something went wrong when loading team members.');
    });
  }

  /**
   * Displays the most recent timesheet.
   */
  displayTimesheet() {
    this.populateTimesheets().then((value) => {
      let timesheet = value as Timesheet;
      this.populateEntries(timesheet);
      this.timesheetService.setCurrentDate();
    }, () =>
      this.errorService.displayErrorMessage('Something went wrong when retrieving timesheets.')
    );
  }

  /**
   * Populates the list of timesheets in timesheet service.
   */
  private async populateTimesheets() {
    let promise = new Promise(resolve => {
      resolve(this.timesheetService.populateTimesheets(this.selectedMember.id));
    });
    return await promise;
  }

  /**
   * Populates the list of entries for the specified timesheet.
   * @param timesheet The timesheet to display entries for.
   */
  private populateEntries(timesheet: Timesheet) {
    this.timesheetService.getEntries(timesheet).subscribe((data) => {
      this.entries = data;
      this.updateTally();
    }, () => {
      this.errorService.displayErrorMessage('Something went wrong when retrieving entries.')
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
    if (currentIndex < this.timesheetService.timesheets.length - 1) {
      let newIndex: number = currentIndex + 1;
      this.timesheetService.setCurrentTimesheetIndex(newIndex).then(() => {
          this.displayTimesheet();
        }, () => {
          this.errorService.displayErrorMessage('Something went wrong when retrieving the timesheet.' )
        }
      );
    }
  }

  /**
   * Displays the next timesheet.
   */
  displayNextTimesheet() {
    let currentIndex = this.timesheetService.getCurrentTimesheetIndex();

    if (currentIndex > 0) {
      let newIndex: number = currentIndex - 1;
      this.timesheetService.setCurrentTimesheetIndex(newIndex).then(() => {
          this.displayTimesheet();
        }, () => {
          this.errorService.displayErrorMessage('Something went wrong when retrieving the timesheet.');
        }
      );
    }
  }

  /**
   * Displays the specified timesheet.
   * @param index The index of the timesheet to display.
   */
  displaySpecifiedTimesheet(index: number) {
    let currentIndex = this.timesheetService.getCurrentTimesheetIndex();
    let newIndex: number = currentIndex + index;

    if (newIndex < this.timesheetService.timesheets.length) {
      this.timesheetService.setCurrentTimesheetIndex(newIndex).then(() => {
          this.displayTimesheet();
        }, () => {
          this.errorService.displayErrorMessage( 'Something went wrong when retrieving the timesheet.')
        }
      );
    }
  }

  getProductivityReportByMember(member: UserAccount) {
    let url = member._links["productivityreport"];

    return this.http.get(`${url["href"]}`)
      .pipe(catchError(this.errorService.handleError()))
      .pipe(
        map((res: ProductivityReportLine[]) => {
          return res
        })
      );
  }
}
