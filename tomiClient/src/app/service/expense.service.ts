import { Injectable } from '@angular/core';
import {map} from "rxjs/operators";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Expense} from "../model/expense";

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
  expenses: Observable<Array<Expense>>;

  /** used by expense list in project panel service */
  selected: Expense;

  constructor(private http: HttpClient) {
    this.expenses = this.getExpenses(); // added by: James Andrade
  }

  /**
   * Gets all expenses.
   */
  getExpenses(): Observable<Array<Expense>>{
    return this.http.get(`${this.expenseUrl}`).pipe(map((response: Response) => response))
      .pipe(map((data: any) => {
        if (data._embedded !== undefined) {
          return data._embedded.expenses as Expense[];
        } else {
          return [];
        }
      }));
  }

  /**
   * sets the selected expense that will be used in edit expense modal
   * added by: James Andrade
   * @param project the project to be stored as 'selected'
   */
  setSelected(expense: Expense){
    this.selected = expense;
  }


  /**
   * Gets a project with the specified ID.
   * @param id The ID of the project to get.

  getProjectById(id:number){
    return this.http.get(`${this.projectsUrl}/${id}`).pipe(map((response: Response) => response))
      .pipe(map((data: any) => {
        if (data !== undefined) {
          return data as Project;
        } else {
          return null;
        }
      }));
  } */
}
