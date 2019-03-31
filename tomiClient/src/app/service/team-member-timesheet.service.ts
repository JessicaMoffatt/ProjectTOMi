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

  constructor(private http: HttpClient, private router: Router,
              private userAccountService: UserAccountService, private teamService: TeamService,
              public timesheetService: TimesheetService, public snackBar: MatSnackBar,
              private signInService:SignInService) {
  }

  getProductivityReportByMember(member: UserAccount) {
    if(member._links === undefined){
      return null;
    }
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
