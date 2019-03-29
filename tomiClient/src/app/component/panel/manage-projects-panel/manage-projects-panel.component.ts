import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {Project} from "../../../model/project";
import {ProjectService} from "../../../service/project.service";
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
  MatInput,
  MatPaginator,
  MatSelect,
  MatSnackBar,
  MatTab,
  MatTabChangeEvent
} from "@angular/material";
import {BehaviorSubject} from "rxjs";
import {UserAccount} from "../../../model/userAccount";
import {SignInService} from "../../../service/sign-in.service";
import {DataDumpReportComponent} from "../../extra/data-dump-report/data-dump-report.component";
import {Team} from "../../../model/team";
import {FormControl, Validators} from "@angular/forms";
import {UserAccountService} from "../../../service/user-account.service";
import {DeleteTeamModal, ManageTeamsPanelComponent} from "../manage-teams-panel/manage-teams-panel.component";

@Component({
  selector: 'app-projects-panel',
  templateUrl: './manage-projects-panel.component.html',
  styleUrls: ['./manage-projects-panel.component.scss']
})
export class ManageProjectsPanelComponent implements OnInit {
  PAGE_SIZE: number = 8;
  private selectedProject: Project= null;
  private projectPageNumber: number = 0;

  /** Validations for the name. */
  projectNameControl = new FormControl('', [
    Validators.required
  ]);

  @ViewChild('editProjectName') editProjectName: MatInput;
  @ViewChild('editProjectClient') editProjectClient: MatInput;
  @ViewChild('editProjectBillingRate') editProjectBillingRate: MatInput;
  @ViewChild('editProjectBudget') editProjectBudget: MatInput;
  @ViewChild('editProjectManagerId') editProjectManagerId: MatSelect;

  @ViewChild('sideBar') sideBar;
  @ViewChild('memberPaginator') memberPaginator: MatPaginator;
  @ViewChild('availablePaginator') availablePaginator: MatPaginator;

  @ViewChild('dumpTab') dumpTab: MatTab;
  @ViewChild('dataDumpReport') dataDumpReport: DataDumpReportComponent;

  constructor(private projectService: ProjectService,
              public snackBar:MatSnackBar, public signInService:SignInService, public deleteProjectDialog: MatDialog) {
  }

  project: Project;

  ngOnInit() {
    this.projectService.setSelected(null);
    this.projectService.userAccountList = new BehaviorSubject<Array<UserAccount>>([]);

  }

  setValuesOnOpen() {
    this.projectNameControl.setValue(this.selectedProject.projectName);
    this.projectClientControl.setValue(this.selectedProject.client.name);
    this.projectBillingControl.setValue(this.selectedProject.billableRate);
    this.projectBudgetControl.setValue(this.selectedProject.budget);
  }

  tabEvent(event:MatTabChangeEvent){
    if(event.tab === this.dumpTab){
      this.dataDumpReport.getDataDump();
    }
  }

  isProjectSelected():boolean{
    return this.selectedProject != null;
  }

  getSelectedProject(){
    return this.selectedProject;
  }

  public async save() {
    if (this.projectNameControl.valid) {
      this.selectedProject.projectName = this.projectNameControl.value;
      if (undefined != this.editProjectManagerId.value) {
        this.selectedProject.projectManagerId = this.editProjectManagerId.value;
      } else {
        this.selectedProject.projectManagerId = -1;
      }
      await this.projectService.save(this.selectedProject);
      this.sideBar.unselect(this.selectedProject.id);
      this.selectedProject = null;
    }
  }

  public cancel() {
    this.sideBar.unselect(this.selectedProject.id);
    this.selectedProject = null;
  }

  openDeleteDialog(){
    this.deleteProjectDialog.open(DeleteProjectModal, {
      width: '40vw',
      data: {projectToDelete: this.selectedProject, parent: this}
    });
  }

  public async delete() {
    await this.projectService.delete(this.selectedProject);
    this.sideBar.unselect(this.selectedProject.id);
    this.projectService.initializeProjects();
    this.selectedProject = null;
  }

}

@Component({
  selector: 'app-delete-project-modal',
  templateUrl: './delete-project-modal.html',
  styleUrls: ['./delete-project-modal.scss']
})
/** Inner class for confirmation modal of delete Team. */
export class DeleteProjectModal {
  projectToDelete: Project;

  constructor(public dialogRef: MatDialogRef<DeleteProjectModal>, @Inject(MAT_DIALOG_DATA) public data: DeleteDialogData) {

  }

  ngOnInit() {
    this.projectToDelete = this.data.projectToDelete;
  }

  canceledDelete(): void {
    this.dialogRef.close();
  }

  confirmedDelete() {
    this.data.parent.delete();
    this.dialogRef.close();
  }
}

/** Data interface for the DeleteUserModal */
export interface DeleteDialogData {
  projectToDelete : Project;
  parent: ManageProjectsPanelComponent;
}
