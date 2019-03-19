import {Component, OnInit} from '@angular/core';
import {Project} from "../../../model/project";
import {ProjectService} from "../../../service/project.service";
import {DatePipe} from '@angular/common';
import {MatSnackBar} from "@angular/material";
import {ClientService} from "../../../service/client.service";
import {Client} from "../../../model/client";
import {BehaviorSubject} from "rxjs";
import {UserAccount} from "../../../model/userAccount";

@Component({
  selector: 'app-projects-panel',
  templateUrl: './projects-panel.component.html',
  styleUrls: ['./projects-panel.component.scss']
})


export class ProjectsPanelComponent implements OnInit {

  constructor(private projectService: ProjectService, private datePipe: DatePipe, public snackBar:MatSnackBar, private clientService: ClientService) {
  }

  /** tracks which sub-panel: new project panel, existing project panel, or report panel will be displayed */
  subPanelDisplay: string = "manageProject";


  project: Project;

  ngOnInit() {
    this.projectService.selectedProject=null;
    this.projectService.userAccountList = new BehaviorSubject<Array<UserAccount>>([]);
  }

  /**
   * Retrieves the data dump report for download in xls format.
   */
  getDataDump() {
    this.projectService.getDataDump().subscribe(
      data => {
        console.log("HERE");
        console.log(data);
        let link = document.createElement('a');
        let stuff = window.URL.createObjectURL(data);
        link.href = stuff
        document.body.appendChild(link);
        let today = new Date();
        let dateString = this.datePipe.transform(today, "yyyy-MM-dd");

        link.download = "Data_Dump_" + dateString+".xls";

        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(stuff);

      },
      err => {
        let errorMessage = 'Something went wrong when updating retrieving the data dump report.';
        this.snackBar.open(errorMessage, null, {duration: 5000, politeness: 'assertive', panelClass: 'snackbar-fail', horizontalPosition: 'right'});
      });

    this.subPanelDisplay = "productivityReport";
  }


}
