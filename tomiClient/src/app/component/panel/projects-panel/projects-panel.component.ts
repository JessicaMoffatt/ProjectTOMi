import {Component, OnInit, ViewChild} from '@angular/core';
import {Project} from "../../../model/project";
import {ProjectService} from "../../../service/project.service";
import {MatDialog, MatSnackBar, MatTab, MatTabChangeEvent} from "@angular/material";
import {BehaviorSubject} from "rxjs";
import {UserAccount} from "../../../model/userAccount";
import {SignInService} from "../../../service/sign-in.service";
import {DataDumpReportComponent} from "../../extra/data-dump-report/data-dump-report.component";
import {AddProjectComponent} from "../../modal/add-project/add-project";

@Component({
  selector: 'app-projects-panel',
  templateUrl: './projects-panel.component.html',
  styleUrls: ['./projects-panel.component.scss']
})
export class ProjectsPanelComponent implements OnInit {

  @ViewChild('dumpTab') dumpTab: MatTab;
  @ViewChild('dataDumpReport') dataDumpReport: DataDumpReportComponent;
  @ViewChild("sideBar") sideBar;

  constructor(private projectService: ProjectService, private dialog: MatDialog,
              public snackBar: MatSnackBar, public signInService: SignInService) {
  }

  project: Project;

  async ngOnInit() {
    await this.projectService.setSelected(null);
    this.projectService.userAccountList = new BehaviorSubject<Array<UserAccount>>([]);
  }

  tabEvent(event: MatTabChangeEvent) {
    if (event.tab === this.dumpTab) {
      this.dataDumpReport.getDataDump();
    }
  }

  public unselect(){
    this.sideBar.unselect();
  }

  public openDialog() {
    this.dialog.open(AddProjectComponent, {
      width: "70vw"
    });
  }
}
