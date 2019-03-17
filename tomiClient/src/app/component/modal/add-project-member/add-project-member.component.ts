import {Component, OnInit, ViewChild} from '@angular/core';
import {ProjectService} from "../../../service/project.service";
import {UserAccountService} from "../../../service/user-account.service";
import {UserAccount} from "../../../model/userAccount";


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

  constructor(public userAccountService: UserAccountService, private projectService: ProjectService) { }

  ngOnInit() {
  }

  addUserAccount(){


    console.log("selected value:"+this.selectedUserId)

    if (this.selectedUserId != undefined){
      this.projectService.addUser(this.selectedUserId);
    }
    console.log("user added. in add-project-member-component.ts");
  }

}
