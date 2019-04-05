import {Injectable} from '@angular/core';
import {catchError, map} from "rxjs/operators";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {BehaviorSubject} from "rxjs";
import {Expense} from "../model/expense";
import {projectsUrl} from "../configuration/domainConfiguration";
import {Project} from "../model/project";
import {ErrorService} from "./error.service";

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

  /** used to track the expense being selectedExpense and edited in the components */
  selectedExpense: Expense;

  constructor(private http: HttpClient, private errorService: ErrorService) {
  }

  refreshExpenses(selectedProject: Project) {
    if (selectedProject.id == null) {
      return [];
    } else {
      this.getExpensesByProjectId(selectedProject).toPromise()
        .then(expense => this.expenses = new BehaviorSubject<Array<Expense>>(expense))
        .catch(() => this.errorService.displayError());
    }
  }

  /**
   * Gets a project with the specified ID.
   * @param selectedProject The ID of the project to get expenses for.
   */
  private getExpensesByProjectId(selectedProject: Project) {
    return this.http.get(`${projectsUrl}/${selectedProject.id}/expenses`)
      .pipe(catchError(this.errorService.handleError()))
      .pipe(map((data: any) => {
        if (data._embedded !== undefined) {
          return data._embedded.expenses as Expense[];
        } else {
          return null;
        }
      }));
  }

  save(selectedProject: Project) {
    if (this.selectedExpense.id === -1) {
      this.http.post<Expense>(`${projectsUrl}/${selectedProject.id}/expenses`, JSON.stringify(this.selectedExpense), httpOptions).toPromise()
        .then(response => {
          this.refreshExpenses(selectedProject);
          return response;
        }).catch(() => {
        this.errorService.displayError()
      });
    } else {
      const url = this.selectedExpense._links["update"];
      this.http.put<Expense>(url["href"], JSON.stringify(this.selectedExpense), httpOptions).toPromise()
        .then((response) => {
          this.refreshExpenses(selectedProject);
          return response;
        }).catch(() => {
        this.errorService.displayError()
      });
    }
  }

  delete(expense: Expense, project: Project) {
    const url = `${projectsUrl}/${project.id}/expenses/${expense.id}`;
    this.http.delete<Expense>(url).toPromise()
      .then(() => this.refreshExpenses(project))
      .catch(() => this.errorService.displayError());
  }

}
