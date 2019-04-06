import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {ProjectService} from "../../../../service/project.service";
import {ClientService} from "../../../../service/client.service";
import {Project} from "../../../../model/project";
import {FormControl} from "@angular/forms";
import {ExpenseService} from "../../../../service/expense.service";
import {Client} from "../../../../model/client";
import {UserAccountService} from "../../../../service/user-account.service";
import {ProjectsPanelComponent} from "../projects-panel.component";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material";

/**
 * ProjectDetailComponent  is used to facilitate communication between the view and front end services.
 */
@Component({
  selector: 'app-project-detail',
  templateUrl: './project-detail.component.html',
  styleUrls: ['./project-detail.component.scss']
})
export class ProjectDetailComponent implements OnInit {

  /**
   * The budget value of this Project.
   */
  @ViewChild('budget') budget;

  /**
   * The billing rate value of this Project.
   */
  @ViewChild('billing') billing;

  /**
   * The project manager value of this Project.
   */
  @ViewChild('projectManager') public projectManager;

  constructor(public projectService: ProjectService,
              public clientService: ClientService,
              public expenseService: ExpenseService,
              public userAccountService: UserAccountService,
              @Inject(ProjectsPanelComponent) private parent: ProjectsPanelComponent,
              public deleteProjectDialog: MatDialog) {
  }

  /**
   * Form controller for the name of this Project.
   */
  nameControl = new FormControl();

  /**
   * Form controller for the Client of this Project.
   */
  clientControl = new FormControl();

  /**
   * Form controller for the billing rate of this Project.
   */
  billingControl = new FormControl();

  /**
   * Form controller for the budget of this Project.
   */
  budgetControl = new FormControl();

  /**
   * Initializes UserAccountService's user accounts list, sets the selected Project, and initializes
   * ClientService's clients list.
   */
  ngOnInit() {
    this.userAccountService.initializeUserAccounts();
    this.setProject();
    this.clientService.initializeClients();
  }

  /**
   * Sets the values of the billingControl and budgetControl to values from the selected Project.
   */
  setProject() {
    this.billingControl.setValue(this.projectService.getSelectedProject().budget);
    this.budgetControl.setValue(this.projectService.getSelectedProject().billableRate);
  }

  /**
   *  Passes on the request to save the selected Project to the ProjectService.
   *  Also checks if a new Client has been input, if yes a request is passed on to the ClientService
   *  to save the new Client.
   */
  save() {
    let saveClient = this.projectService.getSelectedClient();

    this.projectService.getSelectedProject().budget = this.budget.nativeElement.value * 100;
    this.projectService.getSelectedProject().billableRate = this.billing.nativeElement.value * 100;
    let project: Project = this.projectService.getSelectedProject();
    if (this.projectManager.value === null || this.projectManager.value === undefined) {

      project.projectManagerId = -1;
    }

    let matchClient = this.clientService.getClientByName(saveClient.name);
    if (matchClient === null) {
      this.clientService.save(saveClient).then((client: Client) => {
        project.client = client;

        this.projectService.save(project);
      });
    } else {
      project.client = matchClient;

      this.projectService.save(project);
    }
    this.parent.unselect();
  }

  /**
   * Checks if the initials of the input account manager's name are empty.
   * @param accountManagerName The name of the account manager whose initials are to be checked.
   */
  private static isValidAccountManagerName(accountManagerName: string) {
    return ProjectDetailComponent.getInitialsFromName(accountManagerName) === "";
  }

  /**
   * Retrieves initials from a given string.
   * @param name The name to get the initials of.
   */
  private static getInitialsFromName(name: string) {
    let words: string[] = name.split(' ');
    if (words.length != 2) return "";
    let first = words[0].charAt(0).toUpperCase();
    let second = words[1].charAt(0).toUpperCase();
    if (!first.match(/[A-Z]/i) || !second.match(/[A-Z]/i)) return "";
    else
      return first + second;
  }

  /**
   *  Passes on the request to delete a UserAccount to the UserAccountService.
   */
  delete() {
    this.projectService.delete(this.projectService.getSelectedProject());
    this.parent.unselect();
  }

  /**
   * Deselects the project and refreshes the list of projects.
   */
  cancel() {
    this.projectService.refreshProjectList();
    this.parent.unselect();
  }

  /**
   * Displays a Modal component for deleting the selected Project.
   */
  openDeleteDialog() {
    let selectedProject = this.projectService.getSelectedProject();
    this.deleteProjectDialog.open(DeleteProjectModal, {
      width: '40vw',
      data: {projectToDelete: selectedProject, parent: this}
    });
  }
}

/**
 * DeleteProjectModel is used to get confirmation from the user regarding their desire to delete a Project.
 */
@Component({
  selector: 'app-delete-project-modal',
  templateUrl: './delete-project-modal.html',
  styleUrls: ['./delete-project-modal.scss']
})
export class DeleteProjectModal {
  projectToDelete: Project;

  constructor(public dialogRef: MatDialogRef<DeleteProjectModal>,
              @Inject(MAT_DIALOG_DATA) public data: DeleteDialogData) {

  }

  ngOnInit() {
    this.projectToDelete = this.data.projectToDelete;
  }

  /** Closes the modal with no extra actions.*/
  canceledDelete(): void {
    this.dialogRef.close();
  }

  /** Facilitates the deletion of the Project, as well as closes the modal.*/
  confirmedDelete() {
    this.data.parent.delete();
    this.dialogRef.close();
  }
}

/** Data interface for the DeleteProjectModal */
export interface DeleteDialogData {
  projectToDelete: Project;
  parent: ProjectDetailComponent;
}
