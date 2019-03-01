import { Component, OnInit } from '@angular/core';
import {ProjectService} from "../../../service/project.service";
import {ClientService} from "../../../service/client.service";
import {Client} from "../../../model/client";

@Component({
  selector: 'app-projects-panel',
  templateUrl: './projects-panel.component.html',
  styleUrls: ['./projects-panel.component.scss','../../../app.component.scss' ]
})


export class ProjectsPanelComponent implements OnInit {

  constructor(public projectService: ProjectService, public clientService: ClientService) { }

  /** tracks which sub-panel: new project panel, existing project panel, or report panel will be displayed */
  subPanelDisplay: string = "newProject";

  ngOnInit() {
  }

  viewProductivityReport() {
    this.subPanelDisplay = "productivityReport";
  }

  setClient(c: Client){
    this.clientService.selected=c;
  }

  displayBlankProject() {
    this.subPanelDisplay = "newProject";
  }

  editProject() {

  }

  archiveProject() {

  }

  deleteProject() {

  }



}
