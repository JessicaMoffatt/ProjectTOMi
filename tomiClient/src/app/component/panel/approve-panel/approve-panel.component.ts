import {Component, OnInit, ViewChild} from '@angular/core';
import {Project} from "../../../model/project";

/**
 * ApprovePanelComponent is used to facilitate communication between the approve view and front end services.
 *
 * @author Jessica Moffatt
 */
@Component({
  selector: 'app-approve-panel',
  templateUrl: './approve-panel.component.html',
  styleUrls: ['./approve-panel.component.scss']
})
export class ApprovePanelComponent implements OnInit {

  /**
   * The selected project.
   */
  private selectedProject:Project = null;

  /**
   * The project entries component within this approve panel component.
   */
  @ViewChild("projectEntries") projectEntries;

  /**
   * The project sidebar component within this approve panel component.
   */
  @ViewChild("sideBar") sideBar;

  /**
   * Sets the selected Project.
   * @param project The Project to set selectedProject to.
   */
  public setSelectedProject(project:Project):void{
    this.selectedProject = project;
    this.projectEntries.setProject(project);
  }

  /**
   * Returns selectedProject.
   */
  public getSelectedProject():Project{
    return this.selectedProject;
  }

  constructor() { }

  ngOnInit() {
  }

  /**
   * Deselects the selected Project.
   */
  public unselect(){
    this.sideBar.unselect(this.selectedProject.id);
    this.selectedProject = null;
  }
}
