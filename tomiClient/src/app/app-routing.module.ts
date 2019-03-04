import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {TimesheetComponent} from "./component/panel/timesheet/timesheet.component";
import {ApprovePanelComponent} from "./component/panel/approve-panel/approve-panel.component";
import {TeamPanelComponent} from "./component/panel/team-panel/team-panel.component";
import {ProjectsPanelComponent} from "./component/panel/projects-panel/projects-panel.component";
import {ManageTeamsPanelComponent} from "./component/panel/manage-teams-panel/manage-teams-panel.component";
import {UnitTypesPanelComponent} from "./component/panel/unit-types-panel/unit-types-panel.component";
import {TasksPanelComponent} from "./component/panel/tasks-panel/tasks-panel.component";
import {UserAccountPanelComponent} from "./component/panel/user-account-panel/user-account-panel.component";
import {SigninComponent} from "./component/panel/signin-panel/signin.component";


const routes: Routes = [
  { path: '', redirectTo: '/signIn', pathMatch: 'full' },
  {path: 'timesheets', component: TimesheetComponent },
  {path: 'approveTimesheets', component: ApprovePanelComponent},
  {path: 'teams', component: TeamPanelComponent},
  {path: 'projects', component: ProjectsPanelComponent},
  {path: 'manageTeams', component: ManageTeamsPanelComponent},
  {path: 'mangeUnitTypes', component: UnitTypesPanelComponent},
  {path: 'manageTasks', component: TasksPanelComponent},
  {path: 'manageUserAccount', component: UserAccountPanelComponent},
  {path: 'signIn', component: SigninComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
