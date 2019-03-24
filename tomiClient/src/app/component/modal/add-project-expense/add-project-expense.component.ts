import {Component, OnInit, ViewChild} from '@angular/core';
import {FormControl, Validators} from "@angular/forms";
import {MatDialogRef} from "@angular/material";
import {Expense} from "../../../model/expense";
import {ExpenseService} from "../../../service/expense.service";
import {Project} from "../../../model/project";
import {ProjectService} from "../../../service/project.service";

@Component({
  selector: 'app-add-project-expense',
  templateUrl: './add-project-expense.component.html',
  styleUrls: ['./add-project-expense.component.scss']
})


export class AddProjectExpenseComponent implements OnInit {

  // value is set by the parent component that opens the dialog
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

  cancel() {
    this.dialogRef.close()
  }

  save() {
    if(this.expenseService.selected == null) {
      this.expenseService.selected = new Expense();
    }
    this.expenseService.selected.notes = this.addExpenseNote.nativeElement.value;
    this.expenseService.selected.amount = this.addExpenseAmount.nativeElement.value;
    this.expenseService.save(this.projectService.selectedProject);
    this.dialogRef.close()
  }
}
