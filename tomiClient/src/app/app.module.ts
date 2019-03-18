import {BrowserModule} from '@angular/platform-browser';
import {InjectionToken, NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {HTTP_INTERCEPTORS} from '@angular/common/http';

import {AppRoutingModule} from './app-routing.module';

import { DatePipe } from '@angular/common';

import {AppComponent} from './app.component';

//Material Imports
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {
  DateAdapter,
  MAT_DATE_LOCALE,
  MatButtonModule,
  MatDatepickerModule, MatExpansionModule, MatGridListModule, MatIconModule,
  MatMenuModule,
  MatNativeDateModule, MatSidenavModule, MatSnackBarModule
} from '@angular/material';
import {MatListModule} from '@angular/material/list';
import {MatCardModule} from '@angular/material/card';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatDialogModule} from '@angular/material/dialog';
import {MatToolbarModule} from "@angular/material";
import {MatCheckboxModule } from '@angular/material/checkbox';
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {MatTabsModule} from '@angular/material/tabs';
import {MatTableModule} from '@angular/material/table';

import {AddTeamComponent, TeamSidebarComponent} from './component/sidebar/team-sidebar/team-sidebar.component';
import {TeamSidebarService} from "./service/team-sidebar.service";
import {OrderModule} from "ngx-order-pipe";
import {MatChipsModule} from "@angular/material";
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
import {UserAccountSidebarService} from "./service/user-account-sidebar-service";
import {AddUserAccountComponent} from './component/modal/add-user-account/add-user-account.component';
import {DeleteUserAccountModal, EditUserComponent} from './component/panel/edit-user/edit-user.component';
import {AddHeaderInterceptor} from "./add-header-interceptor";
import {TimesheetService} from "./service/timesheet.service";
import {AddTaskComponent} from './component/modal/add-task/add-task.component';
import {TaskPanelService} from "./service/task-panel.service";
import {EditTaskComponent} from './component/modal/edit-task/edit-task.component';
import {TeamService} from "./service/team.service";
import {SignInComponent} from './component/panel/sign-in-panel/sign-in.component';
import {SignInService} from "./service/sign-in.service";
import {EntryUneditableComponent} from './component/panel/entry-uneditable/entry-uneditable.component';
import {CustomDateAdapter, DatePickerComponent} from './component/extra/date-picker/date-picker.component';
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
import { UnitTypeSidebarComponent } from './component/sidebar/unit-type-sidebar/unit-type-sidebar.component';
import { AddUnitTypeComponent } from './component/modal/add-unit-type/add-unit-type.component';
import { EditUnitTypeComponent } from './component/modal/edit-unit-type/edit-unit-type.component';
import {AccessGuard} from "./access-guard";
import { ProductivityReportComponent } from './component/extra/productivity-report/productivity-report.component';
import { TeamProductivityReportComponent } from './component/extra/team-productivity-report/team-productivity-report.component';

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
    UnitTypeSidebarComponent,
    AddUnitTypeComponent,
    EditUnitTypeComponent,
    EditTaskComponent,
    AddTaskComponent,
    DeleteUserAccountModal,
    ProductivityReportComponent,
    TeamProductivityReportComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
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
    MatTableModule
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
    EditUnitTypeComponent,
    DeleteUserAccountModal,
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
    {provide: MAT_DATE_LOCALE, useValue: 'en-GB'},
    { provide: DateAdapter, useClass: CustomDateAdapter },
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
    MatTableModule
  ]
})
export class AppModule {
}
