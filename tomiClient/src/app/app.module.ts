import { BsModalService, ComponentLoaderFactory, ModalModule, PositioningService} from "ngx-bootstrap";
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';

import { TeamSidebarComponent } from './component/sidebar/team-sidebar/team-sidebar.component';
import { AddTeamComponent } from './component/modal/add-team/add-team.component';
import {TeamSidebarService} from "./service/team-sidebar.service";
import {OrderModule} from "ngx-order-pipe";

import {
  DeleteEntryModalComponent, SubmitTimesheetModalComponent,
  TimesheetComponent
} from './component/panel/timesheet/timesheet.component';
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
import { EditUserComponent } from './component/panel/edit-user/edit-user.component';
import { ViewUserComponent } from './component/panel/view-user/view-user.component';
import {AddHeaderInterceptor} from "./AddHeaderInterceptor";
import {TimesheetService} from "./service/timesheet.service";
import { EntryUneditableComponent } from './component/panel/entry-uneditable/entry-uneditable.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { DatePickerComponent } from './component/extra/date-picker/date-picker.component';
import { TeamMemberTimesheetComponent } from './component/panel/team-member-timesheet/team-member-timesheet.component';
import { TeamMemberSidebarComponent } from './component/sidebar/team-member-sidebar/team-member-sidebar.component';
import {
  ProjectEntriesComponent,
  SubmitApprovalModalComponent
} from './component/panel/project-entries/project-entries.component';
import { ProjectEntriesSidebarComponent } from './component/sidebar/project-entries-sidebar/project-entries-sidebar.component';
import {ProjectEntriesService} from "./service/project-entries.service";
import {ProjectService} from "./service/project.service";
import { EntryApproveComponent } from './component/panel/entry-approve/entry-approve.component';

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
    EntryUneditableComponent,
    UserAccountSidebarComponent,
    UserAccountComponent,
    AddUserAccountComponent,
    EditUserComponent,
    ViewUserComponent,
    DeleteEntryModalComponent,
    SubmitTimesheetModalComponent,
    DatePickerComponent,
    TeamMemberTimesheetComponent,
    TeamMemberSidebarComponent,
    ProjectEntriesComponent,
    ProjectEntriesSidebarComponent,
    EntryApproveComponent,
    SubmitApprovalModalComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    OrderModule,
    ModalModule,
    BsDatepickerModule.forRoot()
  ],
  entryComponents:[
    EntryComponent,
    AddTeamComponent,
    AddTeamMemberComponent,
    EntryUneditableComponent,
    AddUserAccountComponent,
    DeleteEntryModalComponent,
    SubmitTimesheetModalComponent,
    SubmitApprovalModalComponent
  ],
  providers: [
    TeamSidebarService,
    UserAccountService,
    UserAccountSidebarService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AddHeaderInterceptor,
      multi: true
    },
    TimesheetService,
    BsModalService,
    ComponentLoaderFactory,
    PositioningService,
    ProjectEntriesService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
