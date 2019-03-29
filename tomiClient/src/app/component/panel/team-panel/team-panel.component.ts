import { Component, OnInit } from '@angular/core';
import {SignInService} from "../../../service/sign-in.service";

@Component({
  selector: 'app-team-panel',
  templateUrl: './team-panel.component.html',
  styleUrls: ['./team-panel.component.css']
})
export class TeamPanelComponent implements OnInit {

  constructor(private signInService:SignInService) { }

  ngOnInit() {
  }

  getTeamId(){
    return this.signInService.userAccount.teamId;
  }
}
