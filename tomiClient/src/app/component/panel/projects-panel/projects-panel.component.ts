import { Component, OnInit } from '@angular/core';
import {Project} from "../../../model/project";
import {ProjectService} from "../../../service/project.service";

@Component({
  selector: 'app-projects-panel',
  templateUrl: './projects-panel.component.html',
  styleUrls: ['./projects-panel.component.css']
})
export class ProjectsPanelComponent implements OnInit {

  constructor(private temp:ProjectService) { }

  project:Project;

  ngOnInit() {
    this.temp.getProjectById('JM1001').subscribe((data)=>{
      this.project = data;
    });
  }

}
