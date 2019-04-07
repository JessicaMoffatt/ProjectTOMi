import {Component, NgModule, OnInit} from '@angular/core';
import {SignInService} from "../../../service/sign-in.service";
import {BreakpointObserver, Breakpoints} from "@angular/cdk/layout";
import {TimesheetService} from "../../../service/timesheet.service";
import {Router} from "@angular/router";

/**
 * TopNavBarComponent holds code to be used with the top navigation bar of the page.
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
  /**
   * Represents whether the user of the application is logged in.
   */
  isUserLoggedIn: boolean;
  /**
   * The size of the screen this application is being viewed on.
   */
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

  /**
   * Sets screen size to 2 for a small layout.
   */
  private activateSmallLayout() {
    this.screenSize = 2;
  }

  /**
   * Sets screen size to 1 for a medium layout.
   */
  private activateMediumLayout() {
    this.screenSize = 1;
  }

  /**
   * Sets screen size to 0 for a large layout.
   */
  private activateLargeLayout() {
    this.screenSize = 0;
  }

  /**
   * Repopulates the timesheets for the signed in user and navigates to the timesheets html page.
   */
  public reloadTimesheets(){
    this.timesheetService.setRepopulateTimesheets(true);
    this.router.navigateByUrl('/', {skipLocationChange: true}).finally(() =>
      this.router.navigate(["/my_timesheets"]));
  }
}
