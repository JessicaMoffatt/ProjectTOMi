import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {TimesheetComponent} from "./component/panel/timesheet/timesheet.component";
import {ApprovePanelComponent} from "./component/panel/approve-panel/approve-panel.component";
import {TeamPanelComponent} from "./component/panel/team-panel/team-panel.component";
import {ManageProjectsPanelComponent} from "./component/panel/manage-projects-panel/manage-projects-panel.component";
import {ManageTeamsPanelComponent} from "./component/panel/manage-teams-panel/manage-teams-panel.component";
import {UnitTypePanelComponent} from "./component/panel/unit-types-panel/unit-type-panel.component";
import {TasksPanelComponent} from "./component/panel/tasks-panel/tasks-panel.component";
import {UserAccountComponent} from "./component/panel/user-account/user-account.component";
import {SignInComponent} from "./component/panel/sign-in-panel/sign-in.component";
import {AccessGuard} from "./access-guard";


const routes: Routes = [
  {path: '', redirectTo: '/sign_in', pathMatch: 'full' },
  {path: 'my_timesheets', component: TimesheetComponent, data:{requiresLogin: true}, canActivate: [ AccessGuard ]},
  {path: 'approve_timesheets', component: ApprovePanelComponent, data:{requiresLogin: true}, canActivate: [ AccessGuard ]},
  {path: 'my_team', component: TeamPanelComponent, data:{requiresLogin: true}, canActivate: [ AccessGuard ]},
  {path: 'manage_projects', component: ManageProjectsPanelComponent, data:{requiresLogin: true}, canActivate: [ AccessGuard ]},
  {path: 'manage_teams', component: ManageTeamsPanelComponent, data:{requiresLogin: true}, canActivate: [ AccessGuard ]},
  {path: 'manage_unit_types', component: UnitTypePanelComponent, data:{requiresLogin: true}, canActivate: [ AccessGuard ]},
  {path: 'manage_tasks', component: TasksPanelComponent, data:{requiresLogin: true}, canActivate: [ AccessGuard ]},
  {path: 'manage_user_accounts', component: UserAccountComponent, data:{requiresLogin: true}, canActivate: [ AccessGuard ]},
  {path: 'sign_in', component: SignInComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
