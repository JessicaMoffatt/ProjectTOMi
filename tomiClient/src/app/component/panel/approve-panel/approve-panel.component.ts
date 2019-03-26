import { Component, OnInit } from '@angular/core';
import {Project} from "../../../model/project";

@Component({
  selector: 'app-approve-panel',
  templateUrl: './approve-panel.component.html',
  styleUrls: ['./approve-panel.component.css']
})
export class ApprovePanelComponent implements OnInit {
  private selectedProject:Project = null;


  public setSelectedProject(project:Project):void{
    this.selectedProject = project;
  }

  constructor() { }

  ngOnInit() {
  }

}
