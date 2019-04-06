import {Component, OnInit, ViewChild} from '@angular/core';
import {FormControl, Validators} from "@angular/forms";
import {MatDialogRef} from "@angular/material";
import {Expense} from "../../../model/expense";
import {ExpenseService} from "../../../service/expense.service";
import {Project} from "../../../model/project";
import {ProjectService} from "../../../service/project.service";

/**
 * AddProjectExpenseComponent is used to facilitate communication between the add expense view and front end services.
 *
 * @author James Andrade
 */
@Component({
  selector: 'app-add-project-expense',
  templateUrl: './add-project-expense.component.html',
  styleUrls: ['./add-project-expense.component.scss']
})
export class AddProjectExpenseComponent implements OnInit {

  /**
   * The selected Project.
   */
  selectedProject: Project;

  constructor(public dialogRef: MatDialogRef<AddProjectExpenseComponent>, private expenseService: ExpenseService, private projectService: ProjectService) { }

  /** The input field for the Unit Types's name.*/
  @ViewChild('addExpenseNote') addExpenseNote;

  /** The input field for the Unit Types's unit.*/
  @ViewChild('addExpenseAmount') addExpenseAmount;

  /** Validations for the name. */
  expenseNoteControl= new FormControl('', [
    Validators.required
  ]);

  /** Validations for the unit. */
  expenseAmountControl = new FormControl('', [
    Validators.required,
    Validators.pattern('')
  ]);

  ngOnInit() {
  }

  /**
   * Closes this modal component.
   */
  cancel() {
    this.dialogRef.close()
  }

  /**
   * Passes the request to save a new Expense to the ExpenseService.
   */
  save() {
    if(this.expenseService.selectedExpense == null) {
      this.expenseService.selectedExpense = new Expense();
    }
    this.expenseService.selectedExpense.notes = this.addExpenseNote.nativeElement.value;
    this.expenseService.selectedExpense.amount = (this.addExpenseAmount.nativeElement.value * 100);
    this.expenseService.save(this.projectService.getSelectedProject());
    this.dialogRef.close()
  }
}
