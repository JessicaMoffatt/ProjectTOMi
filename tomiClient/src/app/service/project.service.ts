import { Injectable } from '@angular/core';
import {catchError, map} from "rxjs/operators";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {Observable, throwError} from "rxjs";
import {Project} from "../model/project";
import {projectsUrl} from "../configuration/domainConfiguration";
import {dataDumpUrl} from "../configuration/domainConfiguration";
import {userAccountUrl} from "../configuration/domainConfiguration";
import {BudgetReport} from "../model/budgetReport";
import {billableUrl} from "../configuration/domainConfiguration";
import {BillableHoursReportLine} from "../model/billableHoursReportLine";
import {ProductivityReportLine} from "../model/productivityReportLine";

/**
 * Project service provides services relates to Projects.
 * @author Jessica Moffatt
 * @version 1.0
 */
@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  /** tracks which project is selected in project-panel component and manage-project modal */
  selected: Project; // added by: James Andrade

  selectedBudget: BudgetReport;

  billableReport: BillableHoursReportLine[] = [];

  /** The actual hours spent working on a project.*/
  percentActual:number = 0;

  /** The percent of budgeted hours remaining.*/
  percentRemaining:number = 0;

  constructor(private http: HttpClient) { }

  /**
   * Gets all projects.
   */
  getAllProjects(): Observable<Array<Project>>{
    return this.http.get(`${projectsUrl}`).pipe(map((response: Response) => response))
      .pipe(map((data: any) => {
        if (data._embedded !== undefined) {
          return data._embedded.projects as Project[];
        } else {
          return [];
        }
      }));
  }

  /**
   * Gets the projects for a specified user.
   * @param userId The ID of the user whose projects we want.
   */
  getProjectsForUser(userId:number): Observable<Array<Project>>{
    return this.http.get(`${userAccountUrl}/${userId}/projects`).pipe(map((response: Response) => response))
      .pipe(map((data: any) => {
        if (data._embedded !== undefined) {
          return data._embedded.projects as Project[];
        } else {
          return [];
        }
      }));
  }

  /**
   * sets the selected project that will be used in project-panel and manage-projects component
   * added by: James Andrade
   * @param project the project to be stored as 'selected'
   */
  setSelected(project: Project){
    this.selected = project;
    this.getBudgetReportByProjectId(project)
      .subscribe(
        data => {
          this.selectedBudget = data;
          this.percentActual = this.calculatePercentActual();
          this.percentRemaining = 100- this.percentActual;
        },
        error => {
        });
    this.getBillableReport().subscribe(data=>{
      this.billableReport = data;
      this.billableReport.sort(BillableHoursReportLine.compareName);
    }, error =>{

    });
  }

  /**
   * Gets a project with the specified ID.
   * @param id The ID of the project to get.
   */
  getProjectById(id:string){
    return this.http.get(`${projectsUrl}/${id}`)
      .pipe(
        map((res:Project) => {return res}),catchError(this.handleError)
      );
  }

  /**
   *
   * @param project The project to get a report for.
   */
  getBudgetReportByProjectId(project:Project){
    let url = project._links["budget"];
    return this.http.get(`${url["href"]}`)
      .pipe(
        map((res:BudgetReport) => {return res}),catchError(this.handleError)
      );
  }

  calculatePercentBillable():string{
    if(this.selectedBudget){
      let percent = this.selectedBudget.billableHours/this.selectedBudget.totalHours*100;
      let percentString = percent.toFixed(2);

      return percentString;
    }else{
      return "0";
    }
  }

  calculatePercentActual():number{
    if(this.selectedBudget){
      return this.selectedBudget.totalHours/this.selectedBudget.project.budgetedHours*100;
    }else{
      return 0;
    }
  }

  getBillableReport(){
    return this.http.get(billableUrl)
      .pipe(
        map((res:BillableHoursReportLine[]) => {return res}),catchError(this.handleError)
      );
  }


  /**
   * Retrieves the data dump report as an xls file download.
   * @param project The project to get a report for.
   */
  getDataDump(){
    return this.http.get(`${dataDumpUrl}`, {responseType: 'blob'})
      .pipe(
        map((res) => {return res}),catchError(this.handleError)
      );
  }

  /**
   * General error handling method.
   * @param error The error that occurred.
   */
  private handleError(error: HttpErrorResponse) {
    return throwError(error.message);
  }
}
