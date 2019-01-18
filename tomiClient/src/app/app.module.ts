import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { TimesheetComponent } from './timesheet/timesheet.component';
import { EntryComponent } from './entry/entry.component';

import { TeamComponent } from './team/team.component';
import { TeamSidebarComponent } from './team-sidebar/team-sidebar.component';
import { AddTeamComponent } from './add-team/add-team.component';

@NgModule({
  declarations: [
    AppComponent,
    TimesheetComponent,
    EntryComponent,
    TeamComponent,
    TeamSidebarComponent,
    AddTeamComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  entryComponents:[
    EntryComponent,
    AddTeamComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
