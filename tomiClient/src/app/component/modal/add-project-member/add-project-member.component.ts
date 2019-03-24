import {Component, OnInit} from '@angular/core';
import {ProjectService} from "../../../service/project.service";
import {UserAccountService} from "../../../service/user-account.service";
import {MatDialogRef} from "@angular/material";
import {BehaviorSubject} from "rxjs";
import {UserAccount} from "../../../model/userAccount";


// export interface User {
//   firstName: string;
//   lastName: string;
//   id: number;
// }

@Component({
  selector: 'app-add-project-member',
  templateUrl: './add-project-member.component.html',
  styleUrls: ['./add-project-member.component.scss']
})

export class AddProjectMemberComponent implements OnInit {

  selectedUserId: number;
  availUsersList: BehaviorSubject<Array<UserAccount>> = new BehaviorSubject<Array<UserAccount>>([]);


  constructor(public dialogRef: MatDialogRef<AddProjectMemberComponent>,
              public userAccountService: UserAccountService, private projectService: ProjectService) {
  }

  ngOnInit() {
    this.generateAvailUsersList();
  }

  private generateAvailUsersList() {
    this.availUsersList = new BehaviorSubject<Array<UserAccount>>([]);
    this.userAccountService.userSubject.value
      .forEach(each => {
        // console.log("userSubject:" + each);
        if (!this.projectService.userAccountList.value.map(account => account.id).includes(each.id)) {
          this.availUsersList.getValue().push(each);
        }
      });
  }

  addUserAccount() {
    if (this.selectedUserId != undefined) {
      this.projectService.addUser(this.selectedUserId);
    }
    this.dialogRef.close();
  }

  cancel() {
    this.dialogRef.close();
  }
}
