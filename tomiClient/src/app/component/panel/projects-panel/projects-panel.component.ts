import { Component, OnInit } from '@angular/core';
import {Project} from "../../../model/project";
import {ProjectService} from "../../../service/project.service";
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-projects-panel',
  templateUrl: './projects-panel.component.html',
  styleUrls: ['./projects-panel.component.css']
})
export class ProjectsPanelComponent implements OnInit {

  constructor(private projectService:ProjectService, private datePipe:DatePipe) { }

  project:Project;

  ngOnInit() {
    this.projectService.getProjectById('JM1001').subscribe((data)=>{
      this.project = data;
    });
  }

  getDataDump(){
    this.projectService.getDataDump().subscribe(
      data =>{
      let link = document.createElement('a');
      link.href = window.URL.createObjectURL(data);

      let today = new Date();
      let dateString = this.datePipe.transform(today, "yyyy-MM-dd");

      link.download = "Data_Dump_" + dateString;

      link.click();
    },
        err=>{
          // this.errorBar.openFromComponent(ErrorBarComponent, {
          //   duration: 5000
          // });
    });
  }

  downloadDataDump(){

  }
}
