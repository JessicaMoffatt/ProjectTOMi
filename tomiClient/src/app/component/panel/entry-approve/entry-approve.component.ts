import {Component, Input, OnInit} from '@angular/core';
import {Entry} from "../../../model/entry";
import {TimesheetService} from "../../../service/timesheet.service";
import {Status} from "../../../model/status";
import {EntryService} from "../../../service/entry.service";

@Component({
  selector: 'app-entry-approve',
  templateUrl: './entry-approve.component.html',
  styleUrls: ['../entry/entry.component.scss','./entry-approve.component.scss']
})
export class EntryApproveComponent implements OnInit {
  /** The entry model instance associated with this component. */
  @Input() entry: Entry;

  sts = Status;

  userName:string;
  constructor(private timesheetService:TimesheetService,private entryService:EntryService) { }

  ngOnInit() {
    this.getUserForEntry();
  }

  getUserForEntry(){
    this.timesheetService.getTimesheetById(this.entry.timesheet).subscribe(async(data)=>{
      this.userName = data.userAccount.firstName + " " + data.userAccount.lastName + ": " + data.submitDate;
    });
  }

  approve(){
    if(this.entry.status === Status.APPROVED){
      this.entry.status = Status.SUBMITTED;
    }else{
      this.entry.status = Status.APPROVED;
    }
  }

  reject(){
    if(this.entry.status === Status.REJECTED){
      this.entry.status = Status.SUBMITTED;
    }else{
      this.entry.status = Status.REJECTED;
    }
  }

  async save(){
      return this.entryService.save(this.entry).then();
  }
}
