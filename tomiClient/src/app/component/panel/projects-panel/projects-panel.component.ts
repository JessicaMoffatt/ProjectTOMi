import {Component, OnInit} from '@angular/core';
import {Project} from "../../../model/project";
import {ProjectService} from "../../../service/project.service";
import {DatePipe} from '@angular/common';
import {MatSnackBar} from "@angular/material";
import {BehaviorSubject} from "rxjs";
import {UserAccount} from "../../../model/userAccount";
import {SignInService} from "../../../service/sign-in.service";

@Component({
  selector: 'app-projects-panel',
  templateUrl: './projects-panel.component.html',
  styleUrls: ['./projects-panel.component.scss']
})


export class ProjectsPanelComponent implements OnInit {

  constructor(private projectService: ProjectService,
              public snackBar:MatSnackBar, public signInService:SignInService) {
  }

  project: Project;

  ngOnInit() {
    this.projectService.setSelected(null);
    this.projectService.userAccountList = new BehaviorSubject<Array<UserAccount>>([]);
  }




}
