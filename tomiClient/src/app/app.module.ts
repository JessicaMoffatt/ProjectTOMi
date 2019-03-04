import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatTableModule} from '@angular/material/table';
import {MatInputModule} from '@angular/material/input';
import {MatListModule} from '@angular/material/list';
import {MatCardModule, MatCheckboxModule} from "@angular/material";

//import {MatFormField} from '@angular/material';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {AlertModule, BsDropdownModule, BsModalService, ComponentLoaderFactory, ModalModule, PositioningService} from "ngx-bootstrap";
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
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
import {MatButtonModule} from '@angular/material/button';
import { ViewUserComponent } from './component/panel/view-user/view-user.component';
import {AddHeaderInterceptor} from "./AddHeaderInterceptor";
import {TimesheetService} from "./service/timesheet.service";
import { EntrySubmittedComponent } from './component/panel/entry-submitted/entry-submitted.component';
import { AddTaskComponent } from './component/modal/add-task/add-task.component';
import {TaskPanelService} from "./service/task-panel.service";
import { EditTaskComponent } from './component/modal/edit-task/edit-task.component';
import {ProjectService} from "./service/project.service";
import { EditProjectSubPanelComponent } from './component/panel/projects-panel/edit-project-sub-panel/edit-project-sub-panel.component';
import {MatFormFieldModule, MatInput} from "@angular/material";
import { ExpenseListComponent } from './component/panel/projects-panel/expense-list/expense-list.component';
import { TeamMemberListComponent } from './component/panel/projects-panel/team-member-list/team-member-list.component';

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
    AddTaskComponent,
    EditTaskComponent,
    AddTeamMemberComponent,
    UserAccountSidebarComponent,
    UserAccountComponent,
    AddUserAccountComponent,
    EditUserComponent,
    ViewUserComponent,
    EntrySubmittedComponent,
    DeleteEntryModalComponent,
    SubmitTimesheetModalComponent,
    EditProjectSubPanelComponent,
    ExpenseListComponent,
    TeamMemberListComponent
  ],
  imports: [
    MatCardModule,
    MatCheckboxModule,
    MatTableModule,
    MatListModule,
    MatButtonModule,
    MatAutocompleteModule,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    AlertModule.forRoot(),
    BsDropdownModule.forRoot(),
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    OrderModule,
    ModalModule,
    OrderModule
  ],
  entryComponents:[
    EntryComponent,
    AddTeamComponent,
    AddTeamMemberComponent,
    AddUserAccountComponent,
    EntrySubmittedComponent,
    DeleteEntryModalComponent,
    SubmitTimesheetModalComponent,
    AddTeamMemberComponent,
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
    BsModalService,
    ComponentLoaderFactory,
    PositioningService,
    UserAccountService,
    TaskPanelService,
    ProjectService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
