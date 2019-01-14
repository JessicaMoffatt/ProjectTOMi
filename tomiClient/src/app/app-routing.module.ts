import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TimesheetPanelComponent } from './timesheet-panel/timesheet-panel.component';
import { ApprovePanelComponent } from "./approve-panel/approve-panel.component";
import { ManageTeamsPanelComponent} from "./manage-teams-panel/manage-teams-panel.component";
import {ProjectsPanelComponent} from "./projects-panel/projects-panel.component";
import {TasksPanelComponent} from "./tasks-panel/tasks-panel.component";
import {UnitTypesPanelComponent} from "./unit-types-panel/unit-types-panel.component";
import {UserAccountsPanelComponent} from "./user-accounts-panel/user-accounts-panel.component";
import {TeamPanelComponent} from "./team-panel/team-panel.component";

const routes : Routes = [
  { path: 'timesheetPanel', component: TimesheetPanelComponent},
  { path: 'approvePanel', component: ApprovePanelComponent},
  { path: 'manageTeamsPanel', component: ManageTeamsPanelComponent},
  { path: 'projectsPanel', component: ProjectsPanelComponent},
  { path: 'tasksPanel', component: TasksPanelComponent},
  { path: 'teamPanel', component: TeamPanelComponent},
  { path: 'unitTypesPanel', component: UnitTypesPanelComponent},
  { path: 'userAccountsPanel', component: UserAccountsPanelComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
