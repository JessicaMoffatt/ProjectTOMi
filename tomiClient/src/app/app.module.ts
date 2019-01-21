import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';

import { TeamSidebarComponent } from './team-sidebar/team-sidebar.component';
import { AddTeamComponent } from './add-team/add-team.component';
import {TeamSidebarService} from "./team-sidebar.service";
import {OrderModule} from "ngx-order-pipe";

import { TimesheetComponent } from './timesheet/timesheet.component';
import { EntryComponent } from './entry/entry.component';

import { TeamComponent } from './team/team.component';
import {TopNavBarComponent} from "./top-nav-bar/top-nav-bar.component";
import {ApprovePanelComponent} from "./approve-panel/approve-panel.component";
import {TimesheetPanelComponent} from "./timesheet-panel/timesheet-panel.component";
import {TeamPanelComponent} from "./team-panel/team-panel.component";
import {ProjectsPanelComponent} from "./projects-panel/projects-panel.component";
import {ManageTeamsPanelComponent} from "./manage-teams-panel/manage-teams-panel.component";
import {UnitTypesPanelComponent} from "./unit-types-panel/unit-types-panel.component";
import {TasksPanelComponent} from "./tasks-panel/tasks-panel.component";
import {UserAccountsPanelComponent} from "./user-accounts-panel/user-accounts-panel.component";
import { AddTeamMemberComponent } from './add-team-member/add-team-member.component';

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
    TeamSidebarService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
