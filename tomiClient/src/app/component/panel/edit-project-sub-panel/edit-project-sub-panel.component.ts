import { Component, OnInit } from '@angular/core';
import {ProjectService} from "../../../service/project.service";
import {ClientService} from "../../../service/client.service";
import {Expense} from "../../../model/expense";
import {Project} from "../../../model/project";
import {FormControl} from "@angular/forms";
import {Observable} from "rxjs";
import {map, startWith} from "rxjs/operators";
import {ExpenseService} from "../../../service/expense.service";

@Component({
  selector: 'app-new-project-panel',
  templateUrl: './edit-project-sub-panel.component.html',
  styleUrls: ['./edit-project-sub-panel.component.scss']
})

export class EditProjectSubPanelComponent implements OnInit {

  constructor(public projectService: ProjectService, public clientService: ClientService, public expenseService: ExpenseService) { }

  myControl = new FormControl();
  expenses: Expense[] = [
    {id: 0, notes: 'Pencils', amount: 20.75, active: true, project_id: 1, _links: null},
    {id: 1, notes: 'Helium', amount: 4.26, active: false, project_id: 1, _links: null}];



  filteredOptions: Observable<string[]>;

  displayedColumns: string[] = ['amount', 'notes'];


  ngOnInit() {
  /*  this.filteredOptions = this.myControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      ); */
  }

   /*private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.expenses.filter(notes => notes.toLowerCase().includes(filterValue));
  }*/

  /** Gets the total cost of all transactions. */
  getTotalCost() {
    return 0;
  }

  save(){

    if ((<HTMLInputElement>document.getElementById("project_id")).value !== null)
    {
      if (this.projectService.selected == null) {
        console.log("creating new project");
        this.projectService.selected = new Project();
      }
      this.projectService.selected.projectName = (<HTMLInputElement>document.getElementById("project_name")).value;
      this.projectService.selected.budget = +(<HTMLInputElement>document.getElementById("budget_total")).value;
      this.projectService.selected.billableRate = +(<HTMLInputElement>document.getElementById("billing_rate")).value;
    }
  }

  onHidden(): void {
    console.log('Dropdown is hidden');
  }
  onShown(): void {
    console.log('Dropdown is shown');
  }

  isOpenChange(): void {
    console.log('Dropdown state is changed');
  }

}
