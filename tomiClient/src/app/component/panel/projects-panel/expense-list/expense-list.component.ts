import { Component, OnInit } from '@angular/core';
import {SelectionModel} from "@angular/cdk/collections";
import {Expense} from "../../../../model/expense";
import {FormControl} from "@angular/forms";
import {ExpenseService} from "../../../../service/expense.service";
import {ProjectService} from "../../../../service/project.service";

@Component({
  selector: 'app-expense-list',
  templateUrl: './expense-list.component.html',
  styleUrls: ['./expense-list.component.scss']
})
export class ExpenseListComponent implements OnInit {

  /*expenses: Expense[] = [
    {id: 0, notes: 'Pencils', amount: 20.75, active: true, project_id: 1, _links: null},
    {id: 1, notes: 'Helium', amount: 4.26, active: false, project_id: 1, _links: null}]; */

  /** determines columns and in what order they will be displayed in expenses table */
  displayedColumns: string[] = ['notes', 'amount'];

  selection = new SelectionModel<Expense>(true, []);

  constructor(public expenseService: ExpenseService, private projectService: ProjectService) { }

  ngOnInit() {
  }

}
