import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';

import { TeamSidebarComponent } from './component/team-sidebar/team-sidebar.component';
import { AddTeamComponent } from './component/add-team/add-team.component';
import {TeamSidebarService} from "./service/team-sidebar.service";
import {OrderModule} from "ngx-order-pipe";

import { TimesheetComponent } from './component/timesheet/timesheet.component';
import { EntryComponent } from './component/entry/entry.component';

import { TeamComponent } from './component/team/team.component';
import {TopNavBarComponent} from "./component/top-nav-bar/top-nav-bar.component";
import {ApprovePanelComponent} from "./component/approve-panel/approve-panel.component";
import {TimesheetPanelComponent} from "./component/timesheet-panel/timesheet-panel.component";
import {TeamPanelComponent} from "./component/team-panel/team-panel.component";
import {ProjectsPanelComponent} from "./component/projects-panel/projects-panel.component";
import {ManageTeamsPanelComponent} from "./component/manage-teams-panel/manage-teams-panel.component";
import {UnitTypesPanelComponent} from "./component/unit-types-panel/unit-types-panel.component";
import {TasksPanelComponent} from "./component/tasks-panel/tasks-panel.component";
import {UserAccountsPanelComponent} from "./component/user-accounts-panel/user-accounts-panel.component";
import { AddTeamMemberComponent } from './component/add-team-member/add-team-member.component';
import {UserAccountService} from "./service/user-account.service";

@NgModule({
  declarations: [
    AppComponent,
    TopNavBarComponent,
    ApprovePanelComponent,
    TimesheetPanelComponent,
    TeamPanelComponent,
    ProjectsPanelComponent,
    ManageTeamsPanelComponent,
    UnitTypesPanelComponent,
    TasksPanelComponent,
    UserAccountsPanelComponent,
    TimesheetComponent,
    EntryComponent,
    TeamComponent,
    TeamSidebarComponent,
    AddTeamComponent,
    AddTeamMemberComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    OrderModule
  ],
  entryComponents:[
    EntryComponent,
    AddTeamComponent,
    AddTeamMemberComponent
  ],
  providers: [
    TeamSidebarService,
    UserAccountService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
