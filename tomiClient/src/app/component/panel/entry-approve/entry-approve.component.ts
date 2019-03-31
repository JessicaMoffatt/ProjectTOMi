import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {Entry} from "../../../model/entry";
import {TimesheetService} from "../../../service/timesheet.service";
import {Status} from "../../../model/status";
import {EntryService} from "../../../service/entry.service";
import {MatCard} from "@angular/material";

/**
 * EntryApproveComponent is used to facilitate communication between the view and front end services.
 *
 * @author Jessica Moffatt
 * @version 1.0
 */
@Component({
  selector: 'app-entry-approve',
  templateUrl: './entry-approve.component.html',
  styleUrls: ['../entry/entry.component.scss','./entry-approve.component.scss']
})
export class EntryApproveComponent implements OnInit {
  /** The entry model instance associated with this component. */
  @Input() entry: Entry;


  /**
   * An reference to the Status enum.
   */
  sts = Status;

  /**
   * The username of this entry.
   */
  userName:string;

  constructor(private timesheetService:TimesheetService,private entryService:EntryService) { }

  ngOnInit() {
    this.getUserForEntry();
  }

  /**
   * Gets the user associated with this entry.
   */
  getUserForEntry(){
    this.timesheetService.getTimesheetById(this.entry.timesheet.id).subscribe(async(data)=>{
      this.userName = data.userAccount.firstName + " " + data.userAccount.lastName + ": " + data.submitDate;
    });
  }

  /**
   * Sets the status of the entry to approved, unless it already was approved in which case it resets to submitted.
   */
  approve(){
    if(this.entry.status === Status.APPROVED){
      this.entry.status = Status.SUBMITTED;
      document.getElementById(this.entry.id+"_approve").setAttribute("class", "mat-flat-button entry_btn copy_btn");
    }else{
      this.entry.status = Status.APPROVED;
      document.getElementById(this.entry.id+"_approve").setAttribute("class", "mat-flat-button entry_btn copy_btn_inverted");
      document.getElementById(this.entry.id +"_reject").setAttribute("class", "mat-flat-button entry_btn delete_btn");
    }
  }

  /**
   * Sets the status of the entry to rejected, unless it already was rejected in which case it resets to submitted.
   */
  reject(){
    if(this.entry.status === Status.REJECTED){
      this.entry.status = Status.SUBMITTED;
      document.getElementById(this.entry.id +"_reject").setAttribute("class", "mat-flat-button entry_btn delete_btn");
    }else{
      this.entry.status = Status.REJECTED;
      document.getElementById(this.entry.id+"_approve").setAttribute("class", "mat-flat-button entry_btn copy_btn");
      document.getElementById(this.entry.id +"_reject").setAttribute("class", "mat-flat-button entry_btn delete_btn_inverted");
    }
  }

  /**
   * Saves the status of the entries.
   */
  async save(){
      return this.entryService.save(this.entry).then();
  }
}
