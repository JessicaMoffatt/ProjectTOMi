import {Component, NgModule, OnInit} from '@angular/core';
import {SignInService} from "../../../service/sign-in.service";
import {BreakpointObserver, Breakpoints} from "@angular/cdk/layout";


@NgModule({
  providers: [SignInService]
})
@Component({
  selector: 'app-top-nav-bar',
  templateUrl: './top-nav-bar.component.html',
  styleUrls: ['./top-nav-bar.component.scss']
})
export class TopNavBarComponent implements OnInit {
  signInService: SignInService;
  isUserLoggedIn: boolean;
  screenSize: number;

  constructor(signInService: SignInService, breakpointObserver: BreakpointObserver) {
    this.signInService = signInService;
    this.signInService.isUserLoggedIn.subscribe(value => {
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
}
