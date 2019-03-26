import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {DatePipe} from '@angular/common';
import {OrderModule} from "ngx-order-pipe";

import {AppComponent} from './app.component';
import {AccessGuard} from "./access-guard";
import {AppRoutingModule} from './app-routing.module';
import {AddHeaderInterceptor} from "./add-header-interceptor";

//Material Imports
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {
  DateAdapter,
  MAT_DATE_LOCALE,
  MatButtonModule,
  MatDatepickerModule, MatExpansionModule, MatGridListModule, MatIconModule,
  MatMenuModule,
  MatNativeDateModule, MatSidenavModule, MatSnackBarModule, MatTableModule
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
import {MatChipsModule} from "@angular/material";
import {DragDropModule} from "@angular/cdk/drag-drop";
import {MatButtonToggleModule} from "@angular/material";
import {MatPaginatorModule} from "@angular/material";

// Component Imports
import {TeamSidebarComponent} from './component/sidebar/team-sidebar/team-sidebar.component';
import {
  DeleteEntryModalComponent, SubmitTimesheetModalComponent,
  TimesheetComponent
} from './component/panel/timesheet/timesheet.component';
import {EntryComponent} from './component/panel/entry/entry.component';
import {AddTeamMemberComponent, TeamComponent} from './component/panel/team/team.component';
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
import { AddUnitTypeComponent } from './component/modal/add-unit-type/add-unit-type.component';
import { EditUnitTypeComponent } from './component/panel/edit-unit-type/edit-unit-type.component';
import { ProductivityReportComponent } from './component/extra/productivity-report/productivity-report.component';
import { TeamProductivityReportComponent } from './component/extra/team-productivity-report/team-productivity-report.component';
import { DeleteTaskModal } from "./component/panel/edit-task/edit-task.component";
import {AddTaskComponent} from "./component/modal/add-task/add-task.component";
import {DeleteUnitTypeModal} from "./component/panel/edit-unit-type/edit-unit-type.component";
import {AddTeamComponent} from "./component/modal/add-team/add-team.component";

//Service Imports
import {ProjectEntriesService} from "./service/project-entries.service";
import {SignInService} from "./service/sign-in.service";
import {TaskService} from "./service/task.service";
import {TeamService} from "./service/team.service";
import {TeamService2} from "./service/team2.service";
import {TeamSidebarService} from "./service/team-sidebar.service";
import {TimesheetService} from "./service/timesheet.service";
import {UserAccountService} from "./service/user-account.service";


@NgModule({
  declarations: [
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
    TeamComponent,
    TeamSidebarComponent,
    AddTeamMemberComponent,
    EntryUneditableComponent,
    AddTeamMemberComponent,
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
    AddUnitTypeComponent,
    EditUnitTypeComponent,
    EditTaskComponent,
    DeleteUserAccountModal,
    ProductivityReportComponent,
    TeamProductivityReportComponent,
    DeleteTaskModal,
    AddTaskComponent,
    DeleteUnitTypeModal,
    AddTeamComponent
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
    MatTableModule,
    MatDatepickerModule,
    DragDropModule,
    MatButtonToggleModule,
    MatPaginatorModule
  ],
  entryComponents: [
    EntryComponent,
    AddTeamMemberComponent,
    EntryUneditableComponent,
    AddUserAccountComponent,
    DeleteEntryModalComponent,
    SubmitTimesheetModalComponent,
    SubmitApprovalModalComponent,
    AddTeamMemberComponent,
    EditTaskComponent,
    AddUnitTypeComponent,
    EditUnitTypeComponent,
    DeleteUserAccountModal,
    AddTaskComponent,
    DeleteTaskModal,
    DeleteUnitTypeModal,
    AddTeamComponent
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
