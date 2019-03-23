import { Component, OnInit } from '@angular/core';
import {SelectionModel} from "@angular/cdk/collections";
import {Expense} from "../../../../model/expense";
import {FormControl} from "@angular/forms";
import {ExpenseService} from "../../../../service/expense.service";
import {ProjectService} from "../../../../service/project.service";
import {AddProjectMemberComponent} from "../../../modal/add-project-member/add-project-member.component";
import {MatDialog} from "@angular/material";
import {AddProjectExpenseComponent} from "../../../modal/add-project-expense/add-project-expense.component";

@Component({
  selector: 'app-expense-list',
  templateUrl: './expense-list.component.html',
  styleUrls: ['./expense-list.component.scss']
})
export class ExpenseListComponent implements OnInit {


  /** determines columns and in what order they will be displayed in expenses table */
  displayedColumns: string[] = ['notes', 'amount'];

  selection = new SelectionModel<Expense>(true, []);

  constructor(private dialog: MatDialog, public expenseService: ExpenseService) { }

  ngOnInit() {
  }

  addExpense() {
    this.dialog.open(AddProjectExpenseComponent);
  }
}
