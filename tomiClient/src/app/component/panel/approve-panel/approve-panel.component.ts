import {Component, OnInit, ViewChild} from '@angular/core';
import {Project} from "../../../model/project";

@Component({
  selector: 'app-approve-panel',
  templateUrl: './approve-panel.component.html',
  styleUrls: ['./approve-panel.component.scss']
})
export class ApprovePanelComponent implements OnInit {
  private selectedProject:Project = null;

  @ViewChild("projectEntries") projectEntries;
  @ViewChild("sideBar") sideBar;


  public setSelectedProject(project:Project):void{
    this.selectedProject = project;
    this.projectEntries.setProject(project);
  }

  public getSelectedProject():Project{
    return this.selectedProject;
  }

  constructor() { }

  ngOnInit() {
  }

  public unselect(){
    this.sideBar.unselect(this.selectedProject.id);
    this.selectedProject = null;
  }
}
