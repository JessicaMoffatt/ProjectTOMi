import { BrowserModule } from '@angular/platform-browser';
import {InjectionToken, NgModule} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';

//Material Imports
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatButtonModule} from '@angular/material';
import {MatListModule} from '@angular/material/list';
import {MatCardModule} from '@angular/material/card';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatDialogModule} from '@angular/material/dialog';

import {TeamSidebarComponent} from './component/sidebar/team-sidebar/team-sidebar.component';
import {TeamSidebarService} from "./service/team-sidebar.service";
import {OrderModule} from "ngx-order-pipe";

import {
  DeleteEntryModalComponent, SubmitTimesheetModalComponent,
  TimesheetComponent
} from './component/panel/timesheet/timesheet.component';
import { EntryComponent } from './component/panel/entry/entry.component';

import {TeamComponent} from './component/panel/team/team.component';
import {TopNavBarComponent} from "./component/panel/top-nav-bar/top-nav-bar.component";
import {ApprovePanelComponent} from "./component/panel/approve-panel/approve-panel.component";
import {TimesheetPanelComponent} from "./component/panel/timesheet-panel/timesheet-panel.component";
import {TeamPanelComponent} from "./component/panel/team-panel/team-panel.component";
import {ProjectsPanelComponent} from "./component/panel/projects-panel/projects-panel.component";
import {ManageTeamsPanelComponent} from "./component/panel/manage-teams-panel/manage-teams-panel.component";
import {UnitTypesPanelComponent} from "./component/panel/unit-types-panel/unit-types-panel.component";
import {TasksPanelComponent} from "./component/panel/tasks-panel/tasks-panel.component";
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
import { EntrySubmittedComponent } from './component/panel/entry-submitted/entry-submitted.component';
import { AddTaskComponent } from './component/modal/add-task/add-task.component';
import {TaskPanelService} from "./service/task-panel.service";
import { EditTaskComponent } from './component/modal/edit-task/edit-task.component';

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
    AddTaskComponent,
    EditTaskComponent,
    UserAccountSidebarComponent,
    UserAccountComponent,
    AddUserAccountComponent,
    EditUserComponent,
    ViewUserComponent,
    EntrySubmittedComponent,
    DeleteEntryModalComponent,
    SubmitTimesheetModalComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    OrderModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatListModule,
    MatCardModule,
    MatInputModule,
    MatSelectModule,
    MatDialogModule
  ],
  entryComponents:[
    EntryComponent,
    AddUserAccountComponent,
    EntrySubmittedComponent,
    DeleteEntryModalComponent,
    AddTaskComponent,
    EditTaskComponent
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
    UserAccountService,
    TaskPanelService
  ],
  bootstrap: [AppComponent],
  exports: [
    MatButtonModule,
    MatListModule,
    MatCardModule,
    MatInputModule,
    MatSelectModule
  ]
})
export class AppModule { }
