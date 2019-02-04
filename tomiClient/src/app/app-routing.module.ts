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


const routes: Routes = [
 // { path: '', redirectTo: '/timesheet', pathMatch: 'full' },
  {path: 'timesheetPanel', component: TimesheetComponent },
  {path: 'approvePanel', component: ApprovePanelComponent},
  {path: 'teamPanel', component: TeamPanelComponent},
  {path: 'projectsPanel', component: ProjectsPanelComponent},
  {path: 'manageTeamsPanel', component: ManageTeamsPanelComponent},
  {path: 'unitTypesPanel', component: UnitTypesPanelComponent},
  {path: 'tasksPanel', component: TasksPanelComponent},
  {path: 'userAccountPanel', component: UserAccountPanelComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
