import {Component, OnInit, ViewChild} from '@angular/core';
import {FormControl, Validators} from "@angular/forms";
import {MatDialogRef} from "@angular/material";

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


  projectNameControl = new FormControl('', [
    Validators.required
  ]);

  @ViewChild('addProjectName') addProjectName;

  /** The ngForm for this component */
  @ViewChild('addProjectForm') addProjectForm;

  constructor(public dialogRef: MatDialogRef<AddProjectComponent>) { }

  /**
   * Closes the modal component.
   */
  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit() {

  }

  private async addProject() {
    if (this.projectNameControl.valid) {
      this.dialogRef.close();
    }
  }
}
