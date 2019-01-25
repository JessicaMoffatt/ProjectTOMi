import { Component, OnInit } from '@angular/core';
import {ApiService} from "../../api.service";

@Component({
  selector: 'app-tasks-list',
  templateUrl: './tasks-list.component.html',
  styleUrls: ['./tasks-list.component.css']
})
export class TasksListComponent implements OnInit {

  private tasks: Array<object> = [];

  constructor(private apiService: ApiService) { }

  ngOnInit() {
    this.getTasks();
  }
  public getTasks(){
    this.apiService.getTasks().subscribe((data: Array<object>) => {
      this.tasks = data;
      console.log(data);
    });
  }
}
