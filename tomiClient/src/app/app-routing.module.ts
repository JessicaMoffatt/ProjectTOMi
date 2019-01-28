import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {TimesheetComponent} from "./component/timesheet/timesheet.component";
import {ApprovePanelComponent} from "./component/approve-panel/approve-panel.component";
import {TeamPanelComponent} from "./component/team-panel/team-panel.component";
import {ProjectsPanelComponent} from "./component/projects-panel/projects-panel.component";
import {ManageTeamsPanelComponent} from "./component/manage-teams-panel/manage-teams-panel.component";
import {UnitTypesPanelComponent} from "./component/unit-types-panel/unit-types-panel.component";
import {TasksPanelComponent} from "./component/tasks-panel/tasks-panel.component";
import {UserAccountsPanelComponent} from "./component/user-accounts-panel/user-accounts-panel.component";


const routes: Routes = [
 // { path: '', redirectTo: '/timesheet', pathMatch: 'full' },
  {path: 'timesheetPanel', component: TimesheetComponent },
  {path: 'approvePanel', component: ApprovePanelComponent},
  {path: 'teamPanel', component: TeamPanelComponent},
  {path: 'projectsPanel', component: ProjectsPanelComponent},
  {path: 'manageTeamsPanel', component: ManageTeamsPanelComponent},
  {path: 'unitTypesPanel', component: UnitTypesPanelComponent},
  {path: 'tasksPanel', component: TasksPanelComponent},
  {path: 'userAccountsPanel', component: UserAccountsPanelComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
