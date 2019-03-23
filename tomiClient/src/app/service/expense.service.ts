import {Injectable} from '@angular/core';
import {map} from "rxjs/operators";
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, Observable} from "rxjs";
import {Expense} from "../model/expense";
import {Project} from "../model/project";
import {ProjectService} from "./project.service";

/**
 * Expense service provides services related to Expenses
 * @author James Andrade
 * @version 1.0
 */

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {

  /** The URL for accessing expenses.*/
  private expenseUrl = 'http://localhost:8080/expenses';

  /** used to pass list to project related components */
  expenses: BehaviorSubject<Array<Expense>>;

  constructor(private http: HttpClient) {


  }

  /**
   * Gets all expenses.
   */
  getExpenses(): Observable<Array<Expense>> {
    return this.http.get(`${this.expenseUrl}`).pipe(map((response: Response) => response))
      .pipe(map((data: any) => {
        if (data._embedded !== undefined) {
          return data._embedded.expenses as Expense[];
        } else {
          return [];
        }
      }));
  }

  refreshExpenses(projectId: string){
    if (projectId == null) {
      return [];
    } else {
    this.getExpensesByProjectId(projectId).toPromise()
      .then(expense => this.expenses = new BehaviorSubject<Array<Expense>>(expense)) // added by: James Andrade
      .catch(); //TODO: add error handling
    }
  }


  /**
   * Gets a project with the specified ID.
   * @param projectId The ID of the project to get.
   */
  private getExpensesByProjectId(projectId: string) {

      return this.http.get(`${this.expenseUrl}/${projectId}`)
        .pipe(map((response: Response) => response))
        .pipe(map((data: any) => {
          if (data !== undefined) {
            return data as Project;
          } else {
            return null;
          }
        }));

  }
}
