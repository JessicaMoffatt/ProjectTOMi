import {Component, OnInit, ViewChild} from '@angular/core';
import {FormControl, Validators} from "@angular/forms";
import {MatDialogRef} from "@angular/material";
import {ClientService} from "../../../service/client.service";
import {Project} from "../../../model/project";
import {ProjectService} from "../../../service/project.service";

/**
 * AddTaskComponent is a modal form used to add a new Task to the back end.
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

  accountManagerControl = new FormControl('', [
    Validators.required
  ]);

  projectNameControl = new FormControl('', [
    Validators.required
  ]);

  clientControl = new FormControl('', [
    Validators.required
  ]);

  billingControl = new FormControl('', [
    Validators.required
  ]);

  budgetControl = new FormControl('', [
    Validators.required
  ]);


  @ViewChild('addProjectName') addProjectName;

  /** The ngForm for this component */
  @ViewChild('addProjectForm') addProjectForm;

  constructor(public dialogRef: MatDialogRef<AddProjectComponent>,private projectService:ProjectService,
              public clientService: ClientService) {
  }

  /**
   * Closes the modal component.
   */
  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit() {

  }

  private async addProject() {
    let initials: string;
    let project: Project;
    if (this.projectNameControl.valid && this.accountManagerControl && this.billingControl && this.budgetControl && this.clientControl) {
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
      project.client = this.clientControl.value;
      // this.projectService.save(project);
      this.dialogRef.close();
    }
  }
}
