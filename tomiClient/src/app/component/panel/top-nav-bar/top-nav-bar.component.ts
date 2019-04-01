import {Component, NgModule, OnInit} from '@angular/core';
import {SignInService} from "../../../service/sign-in.service";
import {BreakpointObserver, Breakpoints} from "@angular/cdk/layout";
import {TimesheetService} from "../../../service/timesheet.service";
import {Router} from "@angular/router";

/**
 * @author Karol Talbot
 * @version 1.0
 */
@NgModule({
  providers: [SignInService]
})
@Component({
  selector: 'app-top-nav-bar',
  templateUrl: './top-nav-bar.component.html',
  styleUrls: ['./top-nav-bar.component.scss']
})
export class TopNavBarComponent implements OnInit {
  isUserLoggedIn: boolean;
  screenSize: number;

  constructor(private router: Router, private signInService: SignInService, private breakpointObserver: BreakpointObserver, public timesheetService:TimesheetService) {
    this.signInService = signInService;
    this.signInService.isLoggedIn().subscribe(value => {
      this.isUserLoggedIn = value;
    });
    breakpointObserver.observe([
      Breakpoints.XSmall,
      Breakpoints.Small
    ]).subscribe(result => {
      if (result.matches) {
        this.activateSmallLayout();
      }
    });
    breakpointObserver.observe([
      Breakpoints.Medium
    ]).subscribe(result => {
      if (result.matches) {
        this.activateMediumLayout();
      }
    });
    breakpointObserver.observe([
      Breakpoints.Large,
      Breakpoints.XLarge
    ]).subscribe(result => {
      if (result.matches) {
        this.activateLargeLayout();
      }
    });
  }

  ngOnInit() {
  }

  private activateSmallLayout() {
    this.screenSize = 2;
  }

  private activateMediumLayout() {
    this.screenSize = 1;
  }

  private activateLargeLayout() {
    this.screenSize = 0;
  }

  public reloadTimesheets(){
    this.timesheetService.setRepopulateTimesheets(true);
    this.router.navigateByUrl('/', {skipLocationChange: true}).finally(() =>
      this.router.navigate(["/my_timesheets"]));
  }
}
