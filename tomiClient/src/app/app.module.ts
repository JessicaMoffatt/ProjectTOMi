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
import {TeamSidebarService} from "./team-sidebar.service";
import {OrderModule} from "ngx-order-pipe";

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
    HttpClientModule,
    OrderModule
  ],
  entryComponents:[
    EntryComponent,
    AddTeamComponent
  ],
  providers: [
    TeamSidebarService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
