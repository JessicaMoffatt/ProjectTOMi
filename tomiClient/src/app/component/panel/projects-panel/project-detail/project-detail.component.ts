import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {ProjectService} from "../../../../service/project.service";
import {ClientService} from "../../../../service/client.service";
import {Project} from "../../../../model/project";
import {FormControl} from "@angular/forms";
import {ExpenseService} from "../../../../service/expense.service";
import {Client} from "../../../../model/client";
import {UserAccountService} from "../../../../service/user-account.service";
import {ProjectsPanelComponent} from "../projects-panel.component";


@Component({
  selector: 'app-project-detail',
  templateUrl: './project-detail.component.html',
  styleUrls: ['./project-detail.component.scss']
})

export class ProjectDetailComponent implements OnInit {

  @ViewChild('budget') budget;
  @ViewChild('billing') billing;
  @ViewChild('projectManager') public projectManager;

  constructor(public projectService: ProjectService,
              public clientService: ClientService,
              public expenseService: ExpenseService,
              public userAccountService: UserAccountService,
              @Inject(ProjectsPanelComponent)private parent:ProjectsPanelComponent) {
  }

  nameControl = new FormControl();
  clientControl = new FormControl();
  // TODO Validate that the client name field is not empty
  idControl = new FormControl({
    value: this.projectService.getSelectedProject().id.match(this.projectService.regExp),
    disabled: false
  },);
  billingControl = new FormControl();
  budgetControl = new FormControl();


  ngOnInit() {
    this.userAccountService.initializeUserAccounts();
    this.setProject();
  }

  setProject() {
    this.billingControl.setValue(this.projectService.getSelectedProject().budget);
    this.budgetControl.setValue(this.projectService.getSelectedProject().billableRate);
  }

  save() {
    this.projectService.getSelectedProject().budget = this.budget.nativeElement.value * 100;
    this.projectService.getSelectedProject().billableRate = this.billing.nativeElement.value * 100;
    let project: Project = this.projectService.getSelectedProject();
    if (this.projectManager._selected === null || this.projectManager._selected === undefined) {

      project.projectManagerId = -1;
    }
    // 1. Validate project name is not taken
    // TODO: move to validation in form control
    if (!this.projectService.projectNameIsAvailable(project.projectName)) {
      alert("Invalid project name.  This project name is already taken by another project.")
    }

    // 3. Validate account manager name (for new projects only)
    // if selected is null, then the user is trying to create a new project and
    // we must validate the account manager

    //   alert("account manager name is required.")
    // } else if (this.projectService.getSelectedProject() == null &&
    //   !ProjectDetailComponent.isValidAccountManagerName(this.inAccountManager.nativeElement.value)) {
    //   alert("account manager name is invalid.  Must take the format 'John Smith' or 'j s'");
    // }

    // 4. All necessary data is validated, persist the project

    else {
      // 4.1 Create a new project if necessary along with the initials that will be passed
      // to the backend to create the id (for new projects only).
      // if the selected project is null, it means we are creating a new project
      if (!project.id.match(this.projectService.regExp)) {
        project.id = ProjectDetailComponent.getInitialsFromName(project.id);
      }


      // a null return value indicates that no matching client is found
      if (this.clientService.getClientByName(project.client.name) == null) {
        //  console.log('new client');
        this.clientService.save(project.client).then((client) => {
          if (client instanceof Client) {

            project.client = client;
          }
          //  this.logValues()
          this.projectService.save(project)
        });
      } else {
        // console.log("existing client");
        project.client
          = this.clientService.getClientByName(project.client.name);
        this.projectService.save(project)
      }
    }
    this.projectService.setSelected(new Project());
    this.parent.unselect();
  }

  private static isValidAccountManagerName(accountManagerName: string) {
    return ProjectDetailComponent.getInitialsFromName(accountManagerName) === "";
  }

  private static getInitialsFromName(name: string) {
    let words: string[] = name.split(' ');
    if (words.length != 2) return "";
    let first = words[0].charAt(0).toUpperCase();
    let second = words[1].charAt(0).toUpperCase();
    if (!first.match(/[A-Z]/i) || !second.match(/[A-Z]/i)) return "";
    else
    // console.log("extracted initials:" + first + second);
      return first + second;
  }


  logValues() {
    console.log("project name " + this.projectService.getSelectedProject().projectName);
    console.log("client " + this.projectService.getSelectedProject().client.name);
    console.log("client id " + this.projectService.getSelectedProject().client.id);
    console.log("project manager " + this.projectService.getSelectedProject().projectManagerId);
    console.log("account id " + this.projectService.getSelectedProject().id);
    console.log("billable " + this.projectService.getSelectedProject().billableRate);
    console.log("budget " + this.projectService.getSelectedProject().budget);
  }

  delete() {
    if (this.projectService.getSelectedProject().id.match(this.projectService.regExp)) {
      this.projectService.delete(this.projectService.getSelectedProject());
    }
    this.projectService.setSelected(new Project());
    this.parent.unselect();
  }

  cancel(){
    this.projectService.setSelected(new Project());
    this.parent.unselect();
  }
}
