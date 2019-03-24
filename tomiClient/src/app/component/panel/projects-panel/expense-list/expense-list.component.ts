import { Component, OnInit } from '@angular/core';
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

  constructor(private dialog: MatDialog, public expenseService: ExpenseService, private projectService: ProjectService) { }

  ngOnInit() {
  }

  addExpense() {
    this.dialog.open(AddProjectExpenseComponent);
  }

  edit() {
    this.selection.selected.forEach( expense => console.log("expense:"+expense.notes))
  }

  delete() {
    this.selection.selected
      .forEach( expense => this.expenseService.delete(expense, this.projectService.selectedProject));
    this.selection = new SelectionModel<Expense>(true, []);
  }
}
