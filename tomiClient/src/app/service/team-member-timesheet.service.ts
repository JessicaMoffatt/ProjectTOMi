import {Injectable, OnInit} from '@angular/core';
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
import {TeamSidebarService} from "./team-sidebar.service";

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
  selectedMemberReportToDisplay: ProductivityReportLine[] = [];

  teamMembersReports: ProductivityReportLine[] = [];
  teamMembersReportsToDisplay: ProductivityReportLine[] = [];

  teamid: number = this.signInService.userAccount.teamId;
  team: Team;
  /** The list of entries for the displaying timesheet*/
  entries: Entry[] = [];

  /** The total number of hours worked for the displaying timesheet*/
  tally: number = 0;

  constructor(private http: HttpClient, private router: Router,
              private userAccountService: UserAccountService, private teamService: TeamService,
              public timesheetService: TimesheetService, public snackBar: MatSnackBar,
              private signInService:SignInService, private teamSidebarService:TeamSidebarService) {
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
      })
    }else{
      this.getAllTeamMembersAndReports(this.team);
    }
  }

  getAllTeamMembersAndReports(team:Team){
    this.getAllTeamMembers(team).toPromise().then((data: Array<UserAccount>) => {
      this.teamMembers = data;
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

  setRangeOfProductivityReport(startDate:Date,endDate:Date){
    this.selectedMemberReportToDisplay = this.setRangeOfReport(this.selectedMemberReportToDisplay, this.selectedMemberReport, startDate, endDate);
  }

  setRangeOfTeamProductivityReport(startDate:Date,endDate:Date){
    this.teamMembersReportsToDisplay = this.setRangeOfReport(this.teamMembersReportsToDisplay, this.teamMembersReports, startDate,endDate);
  }

  setRangeOfReport(newReport:ProductivityReportLine[], baseReport:ProductivityReportLine[], startDate:Date, endDate:Date): ProductivityReportLine[]{
    newReport = [];

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
   * Displays the most recent timesheet.
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
   * Populates the list of entries for the specified timesheet.
   * @param id The ID of the timesheet to display entries for.
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
   * Displays the previous timesheet.
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
   * Displays the next timesheet.
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
   * Displays the specified timesheet.
   * @param index The index of the timesheet to display.
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

  getProductivityReportByMember(member: UserAccount) {
    let url = member._links["productivityreport"];

    return this.http.get(`${url["href"]}`)
      .pipe(
        map((res: ProductivityReportLine[]) => {
          return res
        }), catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse) {
    return throwError(error.message);
  }
}
