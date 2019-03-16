import {Component, OnInit} from '@angular/core';
import {Project} from "../../../model/project";
import {ProjectService} from "../../../service/project.service";
import {DatePipe} from '@angular/common';
import {ClientService} from "../../../service/client.service";
import {Client} from "../../../model/client";

@Component({
  selector: 'app-projects-panel',
  templateUrl: './projects-panel.component.html',
  styleUrls: ['./projects-panel.component.scss']
})


export class ProjectsPanelComponent implements OnInit {

  constructor(public projectService: ProjectService, private datePipe: DatePipe, private clientService: ClientService) {
  }


  /** tracks which sub-panel: new project panel, existing project panel, or report panel will be displayed */
  subPanelDisplay: string = "newProject";

  project: Project;

  ngOnInit() {
   // this.projectService.getProjectById('JM1001').subscribe((data) => {
    //  this.project = data;
    //});
    this.projectService.initializeProjects();

  }

  viewProductivityReport() {
    this.subPanelDisplay = "productivityReport";
  }

  setClient(c: Client){
    this.clientService.selected=c;
  }

  displayBlankProject() {
    this.projectService.selected = null;
    this.subPanelDisplay = "newProject";
  }

  editProject() {

  }

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
        // this.errorBar.openFromComponent(ErrorBarComponent, {
        //   duration: 5000
        // });
      });
  }

  downloadDataDump() {

  }
}
