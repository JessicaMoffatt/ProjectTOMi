import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TopNavBarComponent } from './top-nav-bar/top-nav-bar.component';
import { ApprovePanelComponent } from './approve-panel/approve-panel.component';
import { TimesheetPanelComponent } from './timesheet-panel/timesheet-panel.component';
import { TeamPanelComponent } from './team-panel/team-panel.component';
import { ProjectsPanelComponent } from './projects-panel/projects-panel.component';
import { ManageTeamsPanelComponent } from './manage-teams-panel/manage-teams-panel.component';
import { UnitTypesPanelComponent } from './unit-types-panel/unit-types-panel.component';
import { TasksPanelComponent } from './tasks-panel/tasks-panel.component';
import { UserAccountsPanelComponent } from './user-accounts-panel/user-accounts-panel.component';

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
    UserAccountsPanelComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
