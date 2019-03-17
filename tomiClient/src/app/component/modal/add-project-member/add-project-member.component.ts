import {Component, OnInit} from '@angular/core';
import {ProjectService} from "../../../service/project.service";
import {UserAccountService} from "../../../service/user-account.service";
import {MatDialogRef} from "@angular/material";


export interface User {
  firstName: string;
  lastName: string;
  id: number;
}

@Component({
  selector: 'app-add-project-member',
  templateUrl: './add-project-member.component.html',
  styleUrls: ['./add-project-member.component.scss']
})
export class AddProjectMemberComponent implements OnInit {


  selectedUserId: number;

  constructor(public dialogRef: MatDialogRef<AddProjectMemberComponent>,
    public userAccountService: UserAccountService, private projectService: ProjectService) { }

  ngOnInit() {
  }

  addUserAccount(){
    if (this.selectedUserId != undefined){
      this.projectService.addUser(this.selectedUserId);
    }
  }

  cancel() {
    this.dialogRef.close();
  }
}
