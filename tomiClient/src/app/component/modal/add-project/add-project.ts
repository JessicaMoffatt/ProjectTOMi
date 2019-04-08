import {Component, OnInit, ViewChild} from '@angular/core';
import {FormControl, Validators} from "@angular/forms";
import {MatDialogRef} from "@angular/material";
import {ClientService} from "../../../service/client.service";
import {Project} from "../../../model/project";
import {ProjectService} from "../../../service/project.service";
import {Client} from "../../../model/client";

/**
 * AddTaskComponent is used to facilitate communication between the add project view and front end services.
 *
 * @author Karol Talbot
 * @version 2.0
 */
@Component({
  selector: 'app-add-project',
  templateUrl: './add-project.component.html',
  styleUrls: ['./add-project.component.scss']
})
export class AddProjectComponent implements OnInit {

  /** Validations for the account manager. */
  accountManagerControl = new FormControl('', [
    Validators.required
  ]);

  /** Validations for the project name. */
  projectNameControl = new FormControl('', [
    Validators.required
  ]);

  /** Validations for the client. */
  clientControl = new FormControl('', [
    Validators.required
  ]);

  /** Validations for the billing rate. */
  billingControl = new FormControl('', [
    Validators.required
  ]);

  /** Validations for the budget amount. */
  budgetControl = new FormControl('', [
    Validators.required
  ]);

  /** The input field for the Project's name.*/
  @ViewChild('addProjectName') addProjectName;

  /** The ngForm for this component */
  @ViewChild('addProjectForm') addProjectForm;

  constructor(public dialogRef: MatDialogRef<AddProjectComponent>, private projectService: ProjectService,
              public clientService: ClientService) {
  }

  ngOnInit() {

  }

  /**
   * Closes the modal component.
   */
  onNoClick(): void {
    this.dialogRef.close();
  }

  /**
   * Passes the request to save a new Project to the ProjectService.
   * As well, if a new Client is creaed, passes the request to save the new Client to the ClientService.
   */
  async addProject() {
    let initials: string;
    let project: Project;
    if (this.projectNameControl.valid && this.accountManagerControl.valid && this.billingControl.valid && this.budgetControl.valid && this.clientControl.valid) {
      project = new Project();
      initials = '';
      project.projectName = this.projectNameControl.value;
      project.billableRate = this.billingControl.value;
      project.budget = this.budgetControl.value;
      this.accountManagerControl.value.toString().split(" ").forEach(name => {
        if (initials.length < 2) {
          initials += name.charAt(0).toUpperCase();
        }
      });
      project.id = initials;
      let saveClient = new Client();
      saveClient.name = this.clientControl.value;
      let matchClient = this.clientService.getClientByName(saveClient.name);
      if (matchClient === null) {
        this.clientService.save(saveClient).then((client: Client) => {
          project.client = client;

          this.projectService.save(project).then(() => {
            this.projectService.refreshProjectList();
            this.dialogRef.close();
          });
        });
      } else {
        project.client = matchClient;
        this.projectService.save(project).then(() => {
          this.projectService.refreshProjectList();
          this.dialogRef.close();
        });
      }
    }
  }
}
