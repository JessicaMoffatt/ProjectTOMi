import {Component, OnInit} from '@angular/core';
import {ProjectService} from "../../../../service/project.service";
import {ClientService} from "../../../../service/client.service";
import {Project} from "../../../../model/project";
import {FormControl} from "@angular/forms";
import {ExpenseService} from "../../../../service/expense.service";
import {Client} from "../../../../model/client";
import {UserAccountService} from "../../../../service/user-account.service";


@Component({
  selector: 'app-edit-project-sub-panel',
  templateUrl: './edit-project-sub-panel.component.html',
  styleUrls: ['./edit-project-sub-panel.component.scss']
})

export class EditProjectSubPanelComponent implements OnInit {

  constructor(public projectService: ProjectService,
              public clientService: ClientService,
              public expenseService: ExpenseService,
              public userAccountService: UserAccountService) {
  }

  myControl = new FormControl();
  myControl2 = new FormControl();

  ngOnInit() {
  }


  save() {

    let projectName: string = (<HTMLInputElement>document.getElementById("project_name")).value;
    let clientName: string = (<HTMLInputElement>document.getElementById("client_name")).value;
    let accountManagerName: string = "";


    // 1. Validate project name is not empty and not taken
    // validate project name is not empty
    if (projectName.length === 0) {
      alert("project name cannot be empty");
    } else if (!this.projectService.projectNameIsAvailable(projectName)) {
      alert("Invalid project name.  This project name is already taken by another project.")
    }

    // 2. Validate that the client name field is not empty
    else if (clientName.length === 0) {
      alert("Client name field cannot be empty.");
    }

    // 3. Validate account manager name (for new projects only)
    // if selected is null, then the user is trying to create a new project and
    // we must validate the account manager
    else if (this.projectService.selected == null && (<HTMLInputElement>document.getElementById("account_manager")).value.length == 0) {
      alert("account manager name is required.")
    } else if (this.projectService.selected == null && !this.isValidAccountManagerName(accountManagerName)) {
      alert("account manager name is invalid.  Must take the format 'John Smith' or 'j s'");
    }

    // 4. All necessary data is validated, persist the project
    else {

      // 4.1 Create a new project if necessary along with the initials that will be passed
      // to the backend to create the id (for new projects only).
      // if the selected project is null, it means we are creating a new project
      if (this.projectService.selected == null) {
        console.log("creating new project");
        this.projectService.selected = new Project();
        accountManagerName = (<HTMLInputElement>document.getElementById("account_manager")).value;
        this.projectService.selected.id = this.getInitialsFromName(accountManagerName);
      }

      // 4.2 Set the Project Name
      this.projectService.selected.projectName = projectName;

      // 4.3 Set the Client
      // if the client exists get the reference, if not create a new one
      let client: Client;
      if (this.clientService.getClientByName(clientName) == null) {
        client = new Client();
        client.name = clientName;
        this.clientService.save(client);
        console.log("new client saved.")
      } else {
        console.log("existing client loaded.");
        // @ts-ignore
        client = this.clientService.getClientByName(clientName);
      }
      this.projectService.selected.client = client;

      // 4.4 Set the billable rate and budget (not required fields)
      this.projectService.selected.billableRate = +(<HTMLInputElement>document.getElementById("billing_rate")).value;
      this.projectService.selected.budget = +(<HTMLInputElement>document.getElementById("budget_total")).value;

      this.projectService.save(this.projectService.selected);
      alert("project saved.");
      alert("  project name:" + this.projectService.selected.projectName);
      alert("  client:" + this.projectService.selected.client.name);
      alert("  id:" + this.projectService.selected.id);
      alert("  project manager id:" + this.projectService.selected.projectManager);
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

  private isValidAccountManagerName(accountManagerName: string) {
    if (this.getInitialsFromName(accountManagerName) === "") return false;
    return true;
  }

  private getInitialsFromName(name: string) {
    let words: string[] = name.split(' ');
    if (words.length != 2) return "";
    let first = words[0].charAt(0).toUpperCase();
    let second = words[1].charAt(0).toUpperCase();
    if (!first.match(/[A-Z]/i) || !second.match(/[A-Z]/i)) return "";
    else console.log("extracted initials:" + first + second);
    return first + second;
  }
}
