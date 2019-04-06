import {Component, OnInit, ViewChild} from '@angular/core';
import {Project} from "../../../model/project";
import {ProjectService} from "../../../service/project.service";
import {MatDialog, MatSnackBar, MatTab, MatTabChangeEvent} from "@angular/material";
import {BehaviorSubject} from "rxjs";
import {UserAccount} from "../../../model/userAccount";
import {SignInService} from "../../../service/sign-in.service";
import {DataDumpReportComponent} from "../../extra/data-dump-report/data-dump-report.component";
import {AddProjectComponent} from "../../modal/add-project/add-project";

/**
 * ProjectsPanelComponent is used to facilitate communication between the manage projects view and front end services.
 */
@Component({
  selector: 'app-projects-panel',
  templateUrl: './projects-panel.component.html',
  styleUrls: ['./projects-panel.component.scss']
})
export class ProjectsPanelComponent implements OnInit {

  /**
   * The data dump mat tab component within this projects panel component.
   */
  @ViewChild('dumpTab') dumpTab: MatTab;

  /**
   * The data dump report component within this projects panel component.
   */
  @ViewChild('dataDumpReport') dataDumpReport: DataDumpReportComponent;

  /**
   * The project sidebar component within this projects panel component.
   */
  @ViewChild("sideBar") sideBar;

  constructor(private projectService: ProjectService, private dialog: MatDialog,
              public snackBar: MatSnackBar, public signInService: SignInService) {
  }

  /**
   * The Project being viewed.
   */
  project: Project;

  /**
   * Initializes the ProjectService's userAccountList.
   */
  async ngOnInit() {
    this.projectService.userAccountList = new BehaviorSubject<Array<UserAccount>>([]);
  }

  /**
   * Captures the mat tab change event. If the data dump report tab was clicked,
   * downloads the report.
   * @param event The change event captured.
   */
  tabEvent(event: MatTabChangeEvent) {
    if (event.tab === this.dumpTab) {
      this.dataDumpReport.getDataDump();
    }
  }

  /**
   * Un-selects the project within the sidebar component.
   */
  public unselect(){
    this.sideBar.unselect();
  }

  /**
   * Displays a Modal component for adding a new Project.
   */
  public openDialog() {
    this.dialog.open(AddProjectComponent, {
      width: "70vw"
    });
  }
}
