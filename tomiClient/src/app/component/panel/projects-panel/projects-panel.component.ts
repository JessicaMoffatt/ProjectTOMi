import { Component, OnInit } from '@angular/core';
import {Project} from "../../../model/project";
import {ProjectService} from "../../../service/project.service";

@Component({
  selector: 'app-projects-panel',
  templateUrl: './projects-panel.component.html',
  styleUrls: ['./projects-panel.component.css']
})
export class ProjectsPanelComponent implements OnInit {

  constructor(private projectService:ProjectService) { }

  project:Project;

  ngOnInit() {
    this.projectService.getProjectById('JM1001').subscribe((data)=>{
      this.project = data;
    });
  }

  getDataDump(){
    this.projectService.getDataDump().subscribe(
      data =>{
     window.open(window.URL.createObjectURL(data));
    },
        err=>{

    });
  }

  downloadDataDump(){

  }
}
