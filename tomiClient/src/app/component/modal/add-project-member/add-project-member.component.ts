import {Component, OnInit} from '@angular/core';
import {ProjectService} from "../../../service/project.service";
import {UserAccountService} from "../../../service/user-account.service";
import {MatDialogRef} from "@angular/material";
import {BehaviorSubject} from "rxjs";
import {UserAccount} from "../../../model/userAccount";

/**
 * AddTaskComponent is used to facilitate communication between the add project member view and front end services.
 *
 * @author Karol Talbot
 * @author James Andrade
 */
@Component({
  selector: 'app-add-project-member',
  templateUrl: './add-project-member.component.html',
  styleUrls: ['./add-project-member.component.scss']
})
export class AddProjectMemberComponent implements OnInit {

  /**
   * The ID of the selected UserAccount to add.
   */
  selectedUserId: number;

  /**
   * The list of UserAccounts available to be added to this Project.
   */
  availUsersList: BehaviorSubject<Array<UserAccount>> = new BehaviorSubject<Array<UserAccount>>([]);


  constructor(public dialogRef: MatDialogRef<AddProjectMemberComponent>,
              public userAccountService: UserAccountService, private projectService: ProjectService) {
  }

  ngOnInit() {
    this.generateAvailUsersList();
  }

  /**
   * Populates availUserList with available UserAccounts.
   */
  private generateAvailUsersList() {
    this.availUsersList = new BehaviorSubject<Array<UserAccount>>([]);
    this.userAccountService.userSubject.value
      .forEach(each => {
        if (!this.projectService.userAccountList.value.map(account => account.id).includes(each.id)) {
          this.availUsersList.getValue().push(each);
        }
      });
  }

  /**
   * Passes the request to add the selected UserAccount to the Project to the ProjectService.
   */
  addUserAccount() {
    if (this.selectedUserId != undefined) {
      this.projectService.addUser(this.selectedUserId);
    }
    this.dialogRef.close();
  }

  /**
   * Closes this modal component.
   */
  cancel() {
    this.dialogRef.close();
  }
}
