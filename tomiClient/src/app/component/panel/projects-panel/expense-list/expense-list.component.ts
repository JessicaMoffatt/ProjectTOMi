import {Component, OnInit} from '@angular/core';
import {SelectionModel} from "@angular/cdk/collections";
import {Expense} from "../../../../model/expense";
import {ExpenseService} from "../../../../service/expense.service";
import {MatDialog} from "@angular/material";
import {AddProjectExpenseComponent} from "../../../modal/add-project-expense/add-project-expense.component";
import {ProjectService} from "../../../../service/project.service";

/**
 * ExpenseListComponent is used to facilitate communication between the project expense view and front end services.
 * @author James Andrade
 */
@Component({
  selector: 'app-expense-list',
  templateUrl: './expense-list.component.html',
  styleUrls: ['./expense-list.component.scss']
})
export class ExpenseListComponent implements OnInit {

  /** Determines columns and in what order they will be displayed in the expenses table. */
  displayedColumns: string[] = ['select', 'notes', 'amount'];

  /**
   * List of the selected Expenses.
   */
  selection = new SelectionModel<Expense>(true, []);

  constructor(private dialog: MatDialog, public expenseService: ExpenseService, private projectService: ProjectService) {
  }

  ngOnInit() {
  }

  /**
   * Displays a Modal component for adding a new Expense.
   */
  addExpense() {
    this.expenseService.selectedExpense = new Expense();
    this.dialog.open(AddProjectExpenseComponent)
  }

  /**
   * Opens an existing expense in the addExpenseComponent modal for editing
   * Because the edit button can only be clicked when 1 expense is selected, the for each below will
   * only execute for one item.
   */
  edit() {
    this.selection.selected
      .forEach(expense => {
        this.expenseService.selectedExpense = expense;
        this.dialog.open(AddProjectExpenseComponent).afterClosed().toPromise()
          .finally(() => this.selection = new SelectionModel<Expense>(true, []));
      });
  }

  /**
   * Passes on the request to delete the selected Expenses to the ProjectService.
   */
  delete() {
    this.selection.selected
      .forEach(expense => this.expenseService.delete(expense, this.projectService.getSelectedProject()));
    this.selection = new SelectionModel<Expense>(true, []);
  }
}
