import {BsDropdownModule} from "ngx-bootstrap";
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';

import { TeamSidebarComponent } from './component/sidebar/team-sidebar/team-sidebar.component';
import { AddTeamComponent } from './component/modal/add-team/add-team.component';
import {TeamSidebarService} from "./service/team-sidebar.service";
import {OrderModule} from "ngx-order-pipe";

import { TimesheetComponent } from './component/panel/timesheet/timesheet.component';
import { EntryComponent } from './component/panel/entry/entry.component';

import {TeamComponent } from './component/panel/team/team.component';
import {TopNavBarComponent} from "./component/panel/top-nav-bar/top-nav-bar.component";
import {ApprovePanelComponent} from "./component/panel/approve-panel/approve-panel.component";
import {TimesheetPanelComponent} from "./component/panel/timesheet-panel/timesheet-panel.component";
import {TeamPanelComponent} from "./component/panel/team-panel/team-panel.component";
import {ProjectsPanelComponent} from "./component/panel/projects-panel/projects-panel.component";
import {ManageTeamsPanelComponent} from "./component/panel/manage-teams-panel/manage-teams-panel.component";
import {UnitTypesPanelComponent} from "./component/panel/unit-types-panel/unit-types-panel.component";
import {TasksPanelComponent} from "./component/panel/tasks-panel/tasks-panel.component";
import {AddTeamMemberComponent } from './component/modal/add-team-member/add-team-member.component';
import {UserAccountService} from "./service/user-account.service";
import {UserAccountComponent } from './component/panel/user-account/user-account.component';
import {UserAccountSidebarComponent} from "./component/sidebar/user-account-sidebar/user-account-sidebar.component";
import {UserAccountPanelComponent} from "./component/panel/user-account-panel/user-account-panel.component";
import {UserAccountSidebarService} from "./service/user-account-sidebar-service";
import { AddUserAccountComponent } from './component/modal/add-user-account/add-user-account.component';

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
    UserAccountPanelComponent,
    TimesheetComponent,
    EntryComponent,
    TeamComponent,
    TeamSidebarComponent,
    AddTeamComponent,
    AddTeamMemberComponent,
    UserAccountSidebarComponent,
    UserAccountComponent,
    AddUserAccountComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    OrderModule,
    BsDropdownModule.forRoot()
  ],
  entryComponents:[
    EntryComponent,
    AddTeamComponent,
    AddTeamMemberComponent,
    AddUserAccountComponent
  ],
  providers: [
    TeamSidebarService,
    UserAccountService,
    UserAccountSidebarService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
