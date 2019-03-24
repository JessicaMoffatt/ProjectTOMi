import {Injectable} from '@angular/core';
import {map} from "rxjs/operators";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {BehaviorSubject, Observable} from "rxjs";
import {Expense} from "../model/expense";
import {expenseUrl, projectsUrl} from "../configuration/domainConfiguration";
import {Project} from "../model/project";

/**
 * Expense service provides services related to Expenses
 * @author James Andrade
 * @version 1.0
 */

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})

export class ExpenseService {

  /** used to pass list to project related components */
  expenses: BehaviorSubject<Array<Expense>> = new BehaviorSubject<Array<Expense>>([]);

  /** used to track the expense being selected and edited in the components */
  selected: Expense;

  constructor(private http: HttpClient) {
  }

  /**
   * Gets all expenses.
   * TODO: does it make sense to keep this?  Would we have any reason to access expenses without the projectId?
   */
  getExpenses(): Observable<Array<Expense>> {
    return this.http.get(`${expenseUrl}`).pipe(map((response: Response) => response))
      .pipe(map((data: any) => {
        if (data._embedded !== undefined) {
          return data._embedded.expenses as Expense[];
        } else {
          return [];
        }
      }));
  }

  refreshExpenses(selectedProject: Project) {

    if (selectedProject.id == null) {
      return [];
    } else {
      this.getExpensesByProjectId(selectedProject).toPromise()
        .then(expense => this.expenses = new BehaviorSubject<Array<Expense>>(expense))
        .catch();
    }
  }

  /**
   * Gets a project with the specified ID.
   * @param selectedProject The ID of the project to get expenses for.
   */
  private getExpensesByProjectId(selectedProject: Project) {
    return this.http.get(`${projectsUrl}/${selectedProject.id}/expenses`)
      .pipe(map((response: Response) => response))
      .pipe(map((data: any) => {
        if (data._embedded !== undefined) {
          return data._embedded.expenses as Expense[];
        } else {
          return null;
        }
      }));
  }

  save(selectedProject: Project) {
    if (this.selected.id === -1) {
      this.http.post<Expense>(`${projectsUrl}/${selectedProject.id}/expenses`, JSON.stringify(this.selected), httpOptions).toPromise()
        .then(response => {
          this.refreshExpenses(selectedProject);
          return response;
        }).catch((error: any) => {
        //TODO
      });
    } else {
      const url = this.selected._links["update"];
      this.http.put<Expense>(url["href"], JSON.stringify(this.selected), httpOptions).toPromise()
        .then((response) => {
          this.refreshExpenses(selectedProject);
          return response;
        }).catch((error: any) => {
        //TODO
      });
    }
  }
}
