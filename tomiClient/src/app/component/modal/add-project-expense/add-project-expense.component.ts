import {Component, OnInit, ViewChild} from '@angular/core';
import {FormControl, Validators} from "@angular/forms";
import {MatDialogRef} from "@angular/material";

@Component({
  selector: 'app-add-project-expense',
  templateUrl: './add-project-expense.component.html',
  styleUrls: ['./add-project-expense.component.scss']
})


export class AddProjectExpenseComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<AddProjectExpenseComponent>) { }


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
    console.log("note:"+this.addExpenseNote+", amount:"+this.addExpenseAmount);
  }
}
