import {Injectable} from '@angular/core';
import {catchError, map} from "rxjs/operators";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {BehaviorSubject} from "rxjs";
import {Expense} from "../model/expense";
import {projectsUrl} from "../configuration/domainConfiguration";
import {Project} from "../model/project";
import {ErrorService} from "./error.service";

/**
 * ExpenseService is used to control the flow of data regarding user accounts to/from the view.
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

  /** The list of all Expenses for the Project. */
  expenses: BehaviorSubject<Array<Expense>> = new BehaviorSubject<Array<Expense>>([]);

  /** The selected Expense. */
  selectedExpense: Expense;

  constructor(private http: HttpClient, private errorService: ErrorService) {
  }

  /**
   * Gets the list of Expenses for the selected Project.
   * @param selectedProject The selected Project to get the expenses for.
   */
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
   * Sends a GET message to the server to retrieve the Expenses for the specified Project.
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

  /**
   * Saves the specified Project. If the Project is new (id = -1), an HTTP POST is performed,
   * else an HTTP PUT is performed to update the existing Project.
   *
   * @param selectedProject The Project to be created/updated.
   */
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

  /**
   * Logically deletes the Expense (sets the active status to false).
   * @param expense The Expense to delete.
   * @param project The Project associated with the Expense to be deleted.
   */
  delete(expense: Expense, project: Project) {
    const url = `${projectsUrl}/${project.id}/expenses/${expense.id}`;
    this.http.delete<Expense>(url).toPromise()
      .then(() => this.refreshExpenses(project))
      .catch(() => this.errorService.displayError());
  }
}
