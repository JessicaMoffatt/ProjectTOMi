import {Component, OnInit, ViewChild} from '@angular/core';
import {FormControl, Validators} from "@angular/forms";
import {MatDialogRef} from "@angular/material";
import {Team} from "../../../model/team";
import {TeamService} from "../../../service/team.service";

/**
 * AddTaskComponent is a modal form used to add a new Task to the back end.
 *
 * @author Karol Talbot
 * @version 2.0
 */
@Component({
  selector: 'app-add-team',
  templateUrl: './add-team.component.html',
  styleUrls: ['./add-team.component.scss']
})
export class AddTeamComponent implements OnInit {


  teamNameControl = new FormControl('', [
    Validators.required
  ]);


  @ViewChild('addTeamName') addTeamName;

  /** The ngForm for this component */
  @ViewChild('addTeamForm') addTeamForm;

  constructor(public dialogRef: MatDialogRef<AddTeamComponent>, private teamService:TeamService) { }

  /**
   * Closes the modal component.
   */
  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit() {

  }

  private async addTeam() {
    let teamToAdd = new Team();
    if (this.teamNameControl.valid) {
      teamToAdd.teamName = this.addTeamName.nativeElement.value;
      teamToAdd = await this.teamService.save(teamToAdd).then(
        (value)=> {
          this.teamService.initializeTeams();
          console.log(value);
          return value;
        });
      this.dialogRef.close();
    }
  }
}
