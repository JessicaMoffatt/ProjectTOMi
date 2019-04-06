import {Component, OnInit, ViewChild} from '@angular/core';
import {FormControl, Validators} from "@angular/forms";
import {MatDialogRef} from "@angular/material";
import {Team} from "../../../model/team";
import {TeamService} from "../../../service/team.service";

/**
 * AddTaskComponent is used to facilitate communication between the add team view and front end services.
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

  /** Validations for the team name. */
  teamNameControl = new FormControl('', [
    Validators.required
  ]);

  /** The input field for the Team's name. */
  @ViewChild('addTeamName') addTeamName;

  /** The ngForm for this component */
  @ViewChild('addTeamForm') addTeamForm;

  constructor(public dialogRef: MatDialogRef<AddTeamComponent>, private teamService:TeamService) { }

  ngOnInit() {

  }

  /**
   * Closes this modal component.
   */
  onNoClick(): void {
    this.dialogRef.close();
  }

  /**
   * Passes the request to save a new Tean to the TeamService.
   */
  private async addTeam() {
    let teamToAdd = new Team();
    if (this.teamNameControl.valid) {
      teamToAdd.teamName = this.addTeamName.nativeElement.value;
      teamToAdd = await this.teamService.save(teamToAdd).then(
        (value)=> {
          this.teamService.initializeTeams();
          return value;
        });
      this.dialogRef.close();
    }
  }
}
