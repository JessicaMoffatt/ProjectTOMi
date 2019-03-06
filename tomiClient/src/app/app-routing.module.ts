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
import {AccessGuard} from "./AccessGuard";


const routes: Routes = [
  {path: '', redirectTo: '/sign_in', pathMatch: 'full' },
  {path: 'my_timesheets', component: TimesheetComponent, data:{requiresLogin: true}, canActivate: [ AccessGuard ]},
  {path: 'approve_timesheets', component: ApprovePanelComponent, data:{requiresLogin: true}, canActivate: [ AccessGuard ]},
  {path: 'my_team', component: TeamPanelComponent, data:{requiresLogin: true}, canActivate: [ AccessGuard ]},
  {path: 'manage_projects', component: ProjectsPanelComponent, data:{requiresLogin: true}, canActivate: [ AccessGuard ]},
  {path: 'manage_teams', component: ManageTeamsPanelComponent, data:{requiresLogin: true}, canActivate: [ AccessGuard ]},
  {path: 'manage_unit_types', component: UnitTypesPanelComponent, data:{requiresLogin: true}, canActivate: [ AccessGuard ]},
  {path: 'manage_tasks', component: TasksPanelComponent, data:{requiresLogin: true}, canActivate: [ AccessGuard ]},
  {path: 'manage_user_accounts', component: UserAccountPanelComponent, data:{requiresLogin: true}, canActivate: [ AccessGuard ]},
  {path: 'sign_in', component: SigninComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
