import {Component, NgModule, OnInit} from '@angular/core';
import {SignInService} from "../../../service/sign-in.service";


@NgModule({
  providers: [SignInService]
})
@Component({
  selector: 'app-top-nav-bar',
  templateUrl: './top-nav-bar.component.html',
  styleUrls: ['./top-nav-bar.component.scss']
})
export class TopNavBarComponent implements OnInit {
  signInService:SignInService;
  isUserLoggedIn: boolean;

  constructor(signInService:SignInService) {
    this.signInService = signInService;
    this.signInService.isUserLoggedIn.subscribe( value => {
      this.isUserLoggedIn = value;
    });
  }

  ngOnInit() {
  }
}
