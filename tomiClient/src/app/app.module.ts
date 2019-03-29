import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {DatePipe} from '@angular/common';

import {AppComponent} from './app.component';
import {AccessGuard} from "./access-guard";
import {AppRoutingModule} from './app-routing.module';
import {AddHeaderInterceptor} from "./add-header-interceptor";

//Material Imports
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {
  DateAdapter,
  MatAutocompleteModule,
  MAT_DATE_LOCALE,
  MatButtonModule,
  MatDatepickerModule, MatExpansionModule, MatGridListModule, MatIconModule,
  MatMenuModule, MatTableModule,
  MatNativeDateModule, MatSidenavModule, MatSnackBarModule
} from '@angular/material';
import {MatListModule} from '@angular/material/list';
import {MatCardModule} from '@angular/material/card';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatDialogModule} from '@angular/material/dialog';
import {MatToolbarModule} from "@angular/material";
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {MatTabsModule} from '@angular/material/tabs';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatChipsModule} from "@angular/material";
import {DragDropModule} from "@angular/cdk/drag-drop";
import {MatButtonToggleModule} from "@angular/material";
import {MatPaginatorModule} from "@angular/material";
import {ScrollingModule} from "@angular/cdk/scrolling";

// Component Imports
import {TeamSidebarComponent} from './component/sidebar/team-sidebar/team-sidebar.component';
import {
  DeleteEntryModalComponent, SubmitTimesheetModalComponent,
  TimesheetComponent
} from './component/panel/timesheet/timesheet.component';
import {EntryComponent} from './component/panel/entry/entry.component';
import {TopNavBarComponent} from "./component/panel/top-nav-bar/top-nav-bar.component";
import {ApprovePanelComponent} from "./component/panel/approve-panel/approve-panel.component";
import {TeamPanelComponent} from "./component/panel/team-panel/team-panel.component";
import {ProjectsPanelComponent} from "./component/panel/projects-panel/projects-panel.component";
import {ManageTeamsPanelComponent} from "./component/panel/manage-teams-panel/manage-teams-panel.component";
import {UnitTypePanelComponent} from "./component/panel/unit-types-panel/unit-type-panel.component";
import {TasksPanelComponent} from "./component/panel/tasks-panel/tasks-panel.component";
import {UserAccountComponent} from './component/panel/user-account/user-account.component';
import {AddUserAccountComponent} from './component/modal/add-user-account/add-user-account.component';
import {DeleteUserAccountModal, EditUserComponent} from './component/panel/edit-user/edit-user.component';
import {EditTaskComponent} from './component/panel/edit-task/edit-task.component';
import {SignInComponent} from './component/panel/sign-in-panel/sign-in.component';
import {EntryUneditableComponent} from './component/panel/entry-uneditable/entry-uneditable.component';
import {CustomDateAdapter, DatePickerComponent} from './component/extra/date-picker/date-picker.component';
import {TeamMemberTimesheetComponent} from './component/panel/team-member-timesheet/team-member-timesheet.component';
import {TeamMemberSidebarComponent} from './component/sidebar/team-member-sidebar/team-member-sidebar.component';
import {
  ProjectEntriesComponent,
  SubmitApprovalModalComponent
} from './component/panel/project-entries/project-entries.component';
import {ProjectEntriesSidebarComponent} from './component/sidebar/project-entries-sidebar/project-entries-sidebar.component';
import {EntryApproveComponent} from './component/panel/entry-approve/entry-approve.component';
import {BudgetReportComponent} from './component/extra/budget-report/budget-report.component';
import {ProjectService} from "./service/project.service";
import {ProjectDetailComponent} from './component/panel/projects-panel/project-detail/project-detail.component';
import {MatFormFieldModule} from "@angular/material";
import {ExpenseListComponent} from './component/panel/projects-panel/expense-list/expense-list.component';
import {ProjectMemberListComponent} from './component/panel/projects-panel/project-member-list/project-member-list.component';
import {AddUnitTypeComponent} from './component/modal/add-unit-type/add-unit-type.component';
import {EditUnitTypeComponent} from './component/panel/edit-unit-type/edit-unit-type.component';
import {ProductivityReportComponent} from './component/extra/productivity-report/productivity-report.component';
import {TeamProductivityReportComponent} from './component/extra/team-productivity-report/team-productivity-report.component';
import {BillableHourReportComponent} from './component/extra/billable-hour-report/billable-hour-report.component';
import {DeleteTaskModal} from "./component/panel/edit-task/edit-task.component";
import {AddTaskComponent} from "./component/modal/add-task/add-task.component";
import {DeleteUnitTypeModal} from "./component/panel/edit-unit-type/edit-unit-type.component";
import {AddTeamComponent} from "./component/modal/add-team/add-team.component";
import {AddProjectMemberComponent} from './component/modal/add-project-member/add-project-member.component';
import {ProjectSidebarComponent} from './component/sidebar/project-sidebar/project-sidebar.component';
import {AddProjectExpenseComponent} from './component/modal/add-project-expense/add-project-expense.component';
import {DataDumpReportComponent} from './component/extra/data-dump-report/data-dump-report.component';
import {DeleteTeamModal} from "./component/panel/manage-teams-panel/manage-teams-panel.component";

//Service Imports
import {ProjectEntriesService} from "./service/project-entries.service";
import {SignInService} from "./service/sign-in.service";
import {TaskService} from "./service/task.service";
import {TeamService} from "./service/team.service";
import {TeamService2} from "./service/team2.service";
import {TeamSidebarService} from "./service/team-sidebar.service";
import {TimesheetService} from "./service/timesheet.service";
import {UserAccountService} from "./service/user-account.service";


//Other stuff
import {FilterUserAccountByName} from "./component/panel/user-account/user-account.component";
import {FilterUnitTypeByName} from "./component/panel/unit-types-panel/unit-type-panel.component";
import {FilterTaskByName} from "./component/panel/tasks-panel/tasks-panel.component";
import {FilterTeamByName} from "./component/sidebar/team-sidebar/team-sidebar.component";
import {FilterProjectByName} from "./component/sidebar/project-sidebar/project-sidebar.component";
import {FilterTeamMemberByName} from "./component/sidebar/team-member-sidebar/team-member-sidebar.component";

@NgModule({
  declarations: [
    AddProjectMemberComponent,
    EditUserComponent,
    AddUserAccountComponent,
    AppComponent,
    TopNavBarComponent,
    ApprovePanelComponent,
    TeamPanelComponent,
    ProjectsPanelComponent,
    ManageTeamsPanelComponent,
    UnitTypePanelComponent,
    TasksPanelComponent,
    TimesheetComponent,
    EntryComponent,
    TeamSidebarComponent,
    EntryUneditableComponent,
    UserAccountComponent,
    AddUserAccountComponent,
    EditUserComponent,
    DeleteEntryModalComponent,
    SubmitTimesheetModalComponent,
    SignInComponent,
    DatePickerComponent,
    TeamMemberTimesheetComponent,
    TeamMemberSidebarComponent,
    ProjectEntriesComponent,
    ProjectEntriesSidebarComponent,
    EntryApproveComponent,
    SubmitApprovalModalComponent,
    BudgetReportComponent,
    SubmitTimesheetModalComponent,
    ProjectDetailComponent,
    ExpenseListComponent,
    ProjectMemberListComponent,
    BudgetReportComponent,
    AddUnitTypeComponent,
    EditUnitTypeComponent,
    EditTaskComponent,
    DeleteUserAccountModal,
    ProductivityReportComponent,
    TeamProductivityReportComponent,
    BillableHourReportComponent,
    DeleteTaskModal,
    AddTaskComponent,
    DeleteUnitTypeModal,
    AddTeamComponent,
    TeamProductivityReportComponent,
    DeleteUserAccountModal,
    EditTaskComponent,
    AddProjectMemberComponent,
    ProjectSidebarComponent,
    AddProjectExpenseComponent,
    DataDumpReportComponent,
    FilterUserAccountByName,
    FilterUnitTypeByName,
    FilterTaskByName,
    FilterTeamByName,
    FilterProjectByName,
    FilterTeamMemberByName,
    DeleteTeamModal
  ],
  imports: [
    MatSidenavModule,
    MatSnackBarModule,
    MatGridListModule,
    MatMenuModule,
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
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatListModule,
    MatCardModule,
    MatInputModule,
    MatSelectModule,
    MatDialogModule,
    MatToolbarModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatExpansionModule,
    MatMenuModule,
    MatIconModule,
    MatSnackBarModule,
    MatGridListModule,
    ReactiveFormsModule,
    MatSidenavModule,
    MatSlideToggleModule,
    MatChipsModule,
    MatTabsModule,
    MatTableModule,
    MatProgressBarModule,
    MatDatepickerModule,
    DragDropModule,
    MatButtonToggleModule,
    MatPaginatorModule,
    ScrollingModule
  ],
  entryComponents: [
    AddProjectExpenseComponent,
    AddProjectMemberComponent,
    EntryComponent,
    EntryUneditableComponent,
    AddUserAccountComponent,
    DeleteEntryModalComponent,
    SubmitTimesheetModalComponent,
    SubmitApprovalModalComponent,
    EditTaskComponent,
    AddUnitTypeComponent,
    EditUnitTypeComponent,
    DeleteUserAccountModal,
    AddTaskComponent,
    DeleteTaskModal,
    DeleteUnitTypeModal,
    AddTeamComponent,
    DeleteTeamModal
  ],
  providers: [
    AccessGuard,
    DatePipe,
    ProjectEntriesService,
    SignInService,
    TaskService,
    TeamService,
    TeamService2,
    TeamSidebarService,
    TimesheetService,
    UserAccountService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AddHeaderInterceptor,
      multi: true
    },
    {
      provide: MAT_DATE_LOCALE,
      useValue: 'en-GB'
    },
    {
      provide: DateAdapter,
      useClass: CustomDateAdapter
    },

    TeamService,
    TimesheetService,
    ProjectEntriesService,
    UserAccountService,
    ProjectService,
    SignInService,
    MatDatepickerModule,
    {provide: MAT_DATE_LOCALE, useValue: 'en-GB'},
    {provide: DateAdapter, useClass: CustomDateAdapter},
    AccessGuard,
    DatePipe
  ],
  bootstrap: [AppComponent],
  exports: [
    MatButtonModule,
    MatListModule,
    MatCardModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatExpansionModule,
    MatSidenavModule,
    MatTabsModule,
    MatTableModule,
    MatProgressBarModule,
    FilterUserAccountByName,
    FilterUnitTypeByName,
    FilterTaskByName,
    FilterProjectByName,
    FilterTeamMemberByName,
    FilterTeamByName
  ]
})
export class AppModule {
}
