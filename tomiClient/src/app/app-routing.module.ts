import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {TimesheetComponent} from "./timesheet/timesheet.component";


const routes: Routes = [
  {path: 'timesheet', component: TimesheetComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
