import {Injectable} from '@angular/core';
import {UserAccount} from "../model/userAccount";
import {Observable, throwError} from "rxjs";
import {catchError, map} from "rxjs/operators";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
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

  /** The team member selected in the sidebar.*/
  selectedMember: UserAccount;

  /** The Productivity Report for the selected member, raw.*/
  selectedMemberReport: ProductivityReportLine[] = [];

  /** The Productivity Report for the selected member, edited for display purposes.*/
  selectedMemberReportToDisplay: ProductivityReportLine[] = [];

  /** The Productivity Report for this team, raw. */
  teamMembersReports: ProductivityReportLine[] = [];

  /** The Productivity Report for this team, edited for display purposes.*/
  teamMembersReportsToDisplay: ProductivityReportLine[] = [];

  /** The ID of this team.*/
  teamid: number = this.signInService.userAccount.teamId;

  /** The Team object for this team.*/
  team: Team;

  /** The list of entries for the displayed timesheet.*/
  entries: Entry[] = [];

  /** The total number of hours worked for the displayed timesheet.*/
  tally: number = 0;

  constructor(private http: HttpClient, private router: Router,
              private userAccountService: UserAccountService, private teamService: TeamService,
              public timesheetService: TimesheetService, public snackBar: MatSnackBar,
              private signInService:SignInService) {
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
      this.teamService.getTeamById(this.teamid).subscribe((data)=>{
        this.team = data;
        this.getAllTeamMembersAndReports(data);
      });
    }else{
      this.getAllTeamMembersAndReports(this.team);
    }
  }

  /**
   *  Sorts the team members in the teamMembers list by ascending name.
   */
  sortTeamMembers() {
    this.teamMembers.sort((user1, user2) => {
      let name1 = user1.firstName.toLowerCase() + user1.lastName.toLowerCase();
      let name2 = user2.firstName.toLowerCase() + user2.lastName.toLowerCase();
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
   * Gets all the team members and assigns them into teamMembers.
   * At the same time, also retrieves and combines the productivity reports
   * for the whole team.
   * @param team
   */
  getAllTeamMembersAndReports(team:Team){
    this.getAllTeamMembers(team).subscribe((data: Array<UserAccount>) => {
      this.teamMembers = data;
      this.sortTeamMembers();
      for (let i = 0; i < this.teamMembers.length; i++) {
        this.getProductivityReportByMember(this.teamMembers[i])
          .subscribe((data: ProductivityReportLine[]) => {
            this.teamMembersReports = this.teamMembersReports.concat(data);
            this.teamMembersReports.sort(ProductivityReportLine.compareDate);
            this.teamMembersReports.sort(ProductivityReportLine.compareUser);
            this.teamMembersReports.sort(ProductivityReportLine.compareUnitType);
            this.setRangeOfTeamProductivityReport(new Date(0), new Date());
          }, error => {
            let errorMessage = 'Something went wrong when loading team member productivity reports.';
            this.snackBar.open(errorMessage, null, {
              duration: 5000,
              politeness: 'assertive',
              panelClass: 'snackbar-fail',
              horizontalPosition: 'right'
            });
          });
      }
    }, error => {
      let errorMessage = 'Something went wrong when loading team members.';
      this.snackBar.open(errorMessage, null, {
        duration: 5000,
        politeness: 'assertive',
        panelClass: 'snackbar-fail',
        horizontalPosition: 'right'
      });
    });
  }

  /**
   * Changes the data within the selectedMemberReportToDisplay to reflect the specified date range.
   * @param startDate The starting date for the report period.
   * @param endDate The ending date for the report period.
   */
  setRangeOfProductivityReport(startDate:Date,endDate:Date){
    this.selectedMemberReportToDisplay = this.setRangeOfReport(this.selectedMemberReport, startDate, endDate);
  }

  /**
   * Changes the data within the teamMembersReportsToDisplay to reflect the specified date range.
   * @param startDate The starting date for the report period.
   * @param endDate The ending date for the report period.
   */
  setRangeOfTeamProductivityReport(startDate:Date,endDate:Date){
    this.teamMembersReportsToDisplay = this.setRangeOfReport(this.teamMembersReports, startDate,endDate);
  }

  /**
   * Used to edit out lines from an array of ProductivityReportLine objects.
   * @param baseReport The report to edit.
   * @param startDate The start date of the report period.
   * @param endDate The end date of the report period.
   */
  setRangeOfReport(baseReport:ProductivityReportLine[], startDate:Date, endDate:Date): ProductivityReportLine[]{
    let newReport:ProductivityReportLine[] = [];

    let lastLine:ProductivityReportLine = null;
    let thisLine:ProductivityReportLine = new ProductivityReportLine();

    for(let i = 0; i < baseReport.length; i ++){
      thisLine = new ProductivityReportLine();

      thisLine.date = baseReport[i].date;
      thisLine.quantity = baseReport[i].quantity;
      thisLine.time = baseReport[i].time;
      thisLine.unitType = baseReport[i].unitType;
      thisLine.userAccount = baseReport[i].userAccount;
      thisLine.normalizedValue = baseReport[i].normalizedValue;

      let thisLineDate = new Date(thisLine.date);

      if(thisLineDate >= startDate && thisLineDate <= endDate){
        if(lastLine != null){
          if(lastLine.unitType.name === thisLine.unitType.name && (lastLine.userAccount.firstName+lastLine.userAccount.lastName) === (thisLine.userAccount.firstName+thisLine.userAccount.lastName)){
            lastLine.quantity += thisLine.quantity;
            lastLine.time += thisLine.time;
            lastLine.normalizedValue += thisLine.normalizedValue;
          }else{
            newReport.push(lastLine);
            lastLine = thisLine;
          }
        }else{
          lastLine = thisLine;
        }
      }

      if(i === baseReport.length -1 && lastLine != null){
        newReport.push(lastLine);
      }
    }

    return newReport;
  }

  /**
   * Displays the most recent Timesheet.
   */
  displayTimesheet() {
    this.populateTimesheets().then((value) => {
      let timesheet = value as Timesheet;
      this.populateEntries(timesheet);
      this.timesheetService.setCurrentDate();
    }, reject => {
      let errorMessage = 'Something went wrong when retrieving timesheets.';
      this.snackBar.open(errorMessage, null, {
        duration: 5000,
        politeness: 'assertive',
        panelClass: 'snackbar-fail',
        horizontalPosition: 'right'
      });
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
   * Populates the list of entries for the specified Timesheet.
   * @param id The ID of the Timesheet to display entries for.
   */
  private populateEntries(timesheet: Timesheet) {
    this.timesheetService.getEntries(timesheet).subscribe((data) => {
      this.entries = data;
      this.updateTally();
    }, error => {
      let errorMessage = 'Something went wrong when retrieving entries.';
      this.snackBar.open(errorMessage, null, {
        duration: 5000,
        politeness: 'assertive',
        panelClass: 'snackbar-fail',
        horizontalPosition: 'right'
      });
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
   * Displays the previous Timesheet.
   */
  displayPrevTimesheet() {
    let currentIndex = this.timesheetService.getCurrentTimesheetIndex();

    if (currentIndex < this.timesheetService.timesheets.length - 1) {
      let newIndex: number = currentIndex + 1;
      this.timesheetService.setCurrentTimesheetIndex(newIndex).then(() => {
          this.displayTimesheet();
        }, reject => {
          let errorMessage = 'Something went wrong when retrieving the timesheet.';
          this.snackBar.open(errorMessage, null, {
            duration: 5000,
            politeness: 'assertive',
            panelClass: 'snackbar-fail',
            horizontalPosition: 'right'
          });
        }
      );
    }
  }

  /**
   * Displays the next Timesheet.
   */
  displayNextTimesheet() {
    let currentIndex = this.timesheetService.getCurrentTimesheetIndex();

    if (currentIndex > 0) {
      let newIndex: number = currentIndex - 1;
      this.timesheetService.setCurrentTimesheetIndex(newIndex).then(() => {
          this.displayTimesheet();
        }, reject => {
          let errorMessage = 'Something went wrong when retrieving the timesheet.';
          this.snackBar.open(errorMessage, null, {
            duration: 5000,
            politeness: 'assertive',
            panelClass: 'snackbar-fail',
            horizontalPosition: 'right'
          });
        }
      );
    }
  }

  /**
   * Displays the Timesheet located at the specified index.
   * @param index The index of the Timesheet to display.
   */
  displaySpecifiedTimesheet(index: number) {
    let currentIndex = this.timesheetService.getCurrentTimesheetIndex();
    let newIndex: number = currentIndex + index;

    if (newIndex < this.timesheetService.timesheets.length) {
      this.timesheetService.setCurrentTimesheetIndex(newIndex).then(() => {
          this.displayTimesheet();
        }, reject => {
          let errorMessage = 'Something went wrong when retrieving the timesheet.';
          this.snackBar.open(errorMessage, null, {
            duration: 5000,
            politeness: 'assertive',
            panelClass: 'snackbar-fail',
            horizontalPosition: 'right'
          });
        }
      );
    }
  }

  /**
   * Sends a GET message to the server to retrieve the productivity report for the specified user.
   * @param userAccount The user this report is for.
   */
  getProductivityReportByMember(userAccount: UserAccount) {
    let url = userAccount._links["productivityreport"];

    return this.http.get(`${url["href"]}`)
      .pipe(
        map((res: ProductivityReportLine[]) => {
          return res
        }), catchError(this.handleError)
      );
  }

  /**
   * Sends a GET message to the server to retrieve the productivity report for the specified user
   * as a download in xsl format.
   */
  downloadProductivityReport(){
    let url = this.selectedMember._links["productivityreport"];
    return this.http.get(`${url['href']}/xls`, {responseType: 'blob'})
      .pipe(
        map((res) => {
          return res
        }), catchError(this.handleError)
      );
  }

  /**
   * Throws the passed error.
   * @param error The error to be thrown.
   */
  private handleError(error: HttpErrorResponse) {
    return throwError(error.message);
  }
}
