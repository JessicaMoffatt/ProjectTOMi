import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';

//Material Imports
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatCheckboxModule, MatDatepickerModule, MatNativeDateModule, MatTabsModule} from '@angular/material';
import {MatListModule} from '@angular/material/list';
import {MatCardModule} from '@angular/material/card';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatDialogModule} from '@angular/material/dialog';
import {MatTableModule} from '@angular/material/table';
import {MatToolbarModule} from "@angular/material";

import {AddTeamComponent, TeamSidebarComponent} from './component/sidebar/team-sidebar/team-sidebar.component';
import {TeamSidebarService} from "./service/team-sidebar.service";
import {OrderModule} from "ngx-order-pipe";

import {
  DeleteEntryModalComponent, SubmitTimesheetModalComponent,
  TimesheetComponent
} from './component/panel/timesheet/timesheet.component';
import {EntryComponent} from './component/panel/entry/entry.component';

import {AddTeamMemberComponent, TeamComponent} from './component/panel/team/team.component';
import {TopNavBarComponent} from "./component/panel/top-nav-bar/top-nav-bar.component";
import {ApprovePanelComponent} from "./component/panel/approve-panel/approve-panel.component";
import {TimesheetPanelComponent} from "./component/panel/timesheet-panel/timesheet-panel.component";
import {TeamPanelComponent} from "./component/panel/team-panel/team-panel.component";
import {ProjectsPanelComponent} from "./component/panel/projects-panel/projects-panel.component";
import {ManageTeamsPanelComponent} from "./component/panel/manage-teams-panel/manage-teams-panel.component";
import {UnitTypesPanelComponent} from "./component/panel/unit-types-panel/unit-types-panel.component";
import {TasksPanelComponent} from "./component/panel/tasks-panel/tasks-panel.component";
import {UserAccountService} from "./service/user-account.service";
import {UserAccountComponent} from './component/panel/user-account/user-account.component';
import {UserAccountSidebarComponent} from "./component/sidebar/user-account-sidebar/user-account-sidebar.component";
import {UserAccountPanelComponent} from "./component/panel/user-account-panel/user-account-panel.component";
import {UserAccountSidebarService} from "./service/user-account-sidebar-service";;
import {MatButtonModule} from '@angular/material/button';
import { ViewUserComponent } from './component/panel/view-user/view-user.component';
import {AddHeaderInterceptor} from "./AddHeaderInterceptor";
import {TimesheetService} from "./service/timesheet.service";
// import { EntrySubmittedComponent } from './component/panel/entry-submitted/entry-submitted.component';
import {AddTaskComponent} from './component/modal/add-task/add-task.component';
import {TaskPanelService} from "./service/task-panel.service";
import {TeamService} from "./service/team.service";
import {SigninComponent} from './component/panel/signin-panel/signin.component';
import {SignInService} from "./service/sign-in.service";
import {EntryUneditableComponent} from './component/panel/entry-uneditable/entry-uneditable.component';
import {DatePickerComponent} from './component/extra/date-picker/date-picker.component';
import {TeamMemberTimesheetComponent} from './component/panel/team-member-timesheet/team-member-timesheet.component';
import {TeamMemberSidebarComponent} from './component/sidebar/team-member-sidebar/team-member-sidebar.component';
import {
  ProjectEntriesComponent,
  SubmitApprovalModalComponent
} from './component/panel/project-entries/project-entries.component';
import {ProjectEntriesSidebarComponent} from './component/sidebar/project-entries-sidebar/project-entries-sidebar.component';
import {ProjectEntriesService} from "./service/project-entries.service";
import {EntryApproveComponent} from './component/panel/entry-approve/entry-approve.component';
import {BudgetReportComponent} from './component/extra/budget-report/budget-report.component';
import { EditTaskComponent } from './component/modal/edit-task/edit-task.component';
import {ProjectService} from "./service/project.service";
import { EditProjectSubPanelComponent } from './component/panel/projects-panel/edit-project-sub-panel/edit-project-sub-panel.component';
import {MatFormFieldModule, MatInput} from "@angular/material";
import { ExpenseListComponent } from './component/panel/projects-panel/expense-list/expense-list.component';
import { TeamMemberListComponent } from './component/panel/projects-panel/team-member-list/team-member-list.component';
import { UnitTypeSidebarComponent } from './component/sidebar/unit-type-sidebar/unit-type-sidebar.component';
import { AddUnitTypeComponent } from './component/modal/add-unit-type/add-unit-type.component';
import { EditUnitTypeComponent } from './component/modal/edit-unit-type/edit-unit-type.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {NgModule} from "@angular/core";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {BrowserModule} from "@angular/platform-browser";
import {AddUserAccountComponent} from "./component/modal/add-user-account/add-user-account.component";

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
    AddTeamMemberComponent,
    UserAccountSidebarComponent,
    UserAccountComponent,
    ViewUserComponent,
    DeleteEntryModalComponent,
    SubmitTimesheetModalComponent,
    SigninComponent,
    DatePickerComponent,
    TeamMemberTimesheetComponent,
    TeamMemberSidebarComponent,
    ProjectEntriesComponent,
    ProjectEntriesSidebarComponent,
    EntryApproveComponent,
    SubmitApprovalModalComponent,
    BudgetReportComponent,
    SubmitTimesheetModalComponent,
    EditProjectSubPanelComponent,
    ExpenseListComponent,
    TeamMemberListComponent,
    BudgetReportComponent,
    UnitTypeSidebarComponent,
    AddUnitTypeComponent,
    EditUnitTypeComponent,
    EditTaskComponent,
    AddTaskComponent
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
    MatDialogModule,
    MatToolbarModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  entryComponents: [
    EntryComponent,
    AddTeamComponent,
    AddTeamMemberComponent,
    EntryUneditableComponent,
    AddUserAccountComponent,
    DeleteEntryModalComponent,
    SubmitTimesheetModalComponent,
    SubmitApprovalModalComponent,
    AddTeamMemberComponent,
    AddTaskComponent,
    EditTaskComponent,
    AddUnitTypeComponent,
    EditUnitTypeComponent
  ],
  providers: [
    TeamSidebarService,
    TeamService,
    UserAccountService,
    UserAccountSidebarService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AddHeaderInterceptor,
      multi: true
    },
    TeamService,
    TimesheetService,
    ProjectEntriesService,
    UserAccountService,
    TaskPanelService,
    SignInService,
    MatDatepickerModule,
    TaskPanelService,
    ProjectService
  ],
  bootstrap: [AppComponent],
  exports: [
    MatButtonModule,
    MatListModule,
    MatCardModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule
  ]
})
export class AppModule {
}
