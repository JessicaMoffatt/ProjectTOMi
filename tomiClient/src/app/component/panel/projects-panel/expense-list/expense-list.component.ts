import {Component, OnInit} from '@angular/core';
import {SelectionModel} from "@angular/cdk/collections";
import {Expense} from "../../../../model/expense";
import {ExpenseService} from "../../../../service/expense.service";
import {MatDialog} from "@angular/material";
import {AddProjectExpenseComponent} from "../../../modal/add-project-expense/add-project-expense.component";
import {ProjectService} from "../../../../service/project.service";

@Component({
  selector: 'app-expense-list',
  templateUrl: './expense-list.component.html',
  styleUrls: ['./expense-list.component.scss']
})
export class ExpenseListComponent implements OnInit {


  /** determines columns and in what order they will be displayed in expenses table */
  displayedColumns: string[] = ['select', 'notes', 'amount'];

  selection = new SelectionModel<Expense>(true, []);

  constructor(private dialog: MatDialog, public expenseService: ExpenseService, private projectService: ProjectService) {
  }

  ngOnInit() {
  }

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
    // note: because the list selection only allow
    this.selection.selected
      .forEach(expense => {
        this.expenseService.selectedExpense = expense;
        this.dialog.open(AddProjectExpenseComponent).afterClosed().toPromise()
          .finally(() => this.selection = new SelectionModel<Expense>(true, []));
      });
  }

  delete() {
    this.selection.selected
      .forEach(expense => this.expenseService.delete(expense, this.projectService.getSelectedProject()));
    this.selection = new SelectionModel<Expense>(true, []);
  }
}
