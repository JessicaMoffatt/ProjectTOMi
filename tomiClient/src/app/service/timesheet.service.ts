import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {map} from "rxjs/operators";
import {Entry} from "../model/entry";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Timesheet} from "../model/timesheet";

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

/**
 * TimesheetService is used to control the flow of data regarding timesheets to/from the view.
 *
 * @author Jessica Moffatt
 * @version 2.0
 */
@Injectable({
  providedIn: 'root'
})
export class TimesheetService {
  /** The link used to get,post, and delete entries. */
  private timesheetUrl = `http://localhost:8080/timesheets`;
  /** The link used to get all timesheets for a specified user.*/
  private userTimesheetsUrl = `http://localhost:8080/timesheets/user_accounts`;

  /** The list of all timehseets for this user.*/
  timesheets: Timesheet[] = [];

  /** The position in timesheets for the current timesheet.*/
  private currentTimesheetIndex = 0;

  /** The starting date for the current timesheet.*/
  public currentDate;

  /** The status of the current timesheet.*/
  public currentStatus = "";

  /**
   * The earliest date that can be selected.
   */
  minDate: Date;

  constructor(private http: HttpClient) {
  }

  /**
   * Returns the current timesheet index.
   */
  getCurrentTimesheetIndex(){
    return this.currentTimesheetIndex;
  }

  /**
   * Asynchronously sets the current timesheet index to the specified number.
   * @param index The number to set the index to.
   */
  async setCurrentTimesheetIndex(index: number){
    this.currentTimesheetIndex = index;
    return this.currentTimesheetIndex;
  }

  /**
   * Determines if the minimum date should be set.
   */
  doSetMinDate(){
    if(this.minDate === undefined || this.minDate === null){
      this.setMinDate().then();
    }
  }

  /**
   * Sets the minimum date accordingly.
   */
  async setMinDate(){
    await this.getEarliestDate().then((data)=>{
      let dateString = data.toString().replace(/-/g, '\/').replace(/T.+/, '');

      this.minDate = new Date(dateString);
      return this.minDate;
    });
  }

  /**
   * Gets all entries for the specified timesheet.
   * @param id The ID of the timesheet.
   */
  getEntries(id: number): Observable<Array<Entry>>{
    return this.http.get(`${this.timesheetUrl}/${id}/entries`).pipe(map((response: Response) => response))
      .pipe(map((data: any) => {
        if (data._embedded !== undefined) {
          let sorted = data._embedded.entries as Entry[];
          sorted = sorted.sort((entry1,entry2) => entry1.id - entry2.id);
          return sorted;
        } else {
          return [];
        }
      }));
  }

  /**
   * Gets the current timesheet.
   */
  async getCurrentTimesheet(): Promise<Timesheet> {
    if(this.currentTimesheetIndex != -1){
      return this.timesheets[this.currentTimesheetIndex];
    }
    else return null;
  }

  /**
   * Gets all timesheets for the specified user.
   * @param userId The ID of the user.
   */
  async getAllTimesheets(userId: number) {
    return this.http.get(`${this.userTimesheetsUrl}/${userId}`).pipe(map((response: Response) => response))
      .pipe(map((data: any) => {
        if (data._embedded !== undefined) {
          return data._embedded.timesheets as Timesheet[];
        } else {
          return [];
        }
      }));
  }

  /**
   * Populates timesheets for specified user.
   * @param userId The ID of the user.
   */
  async populateTimesheets(userId: number) {
    return await this.getAllTimesheets(userId).then((response) => {
      return response.toPromise().then((data)=>{
        this.timesheets = data;

        if(this.currentTimesheetIndex >= this.timesheets.length){
          this.currentTimesheetIndex = this.timesheets.length -1;
        }

        this.setCurrentDate();
        this.setCurrentStatus().then();
        return this.getCurrentTimesheet();
      });
    });
  }

  /**
   * Sets the current date to display.
   */
  setCurrentDate(){
    // force LOCAL time with +'T00:00:00'
    if(this.currentTimesheetIndex != -1){
      let tempDay = new Date(this.timesheets[this.currentTimesheetIndex].startDate +'T00:00:00');
      let options = {
        year: 'numeric', month: 'long', day: 'numeric'
      };

      this.currentDate = tempDay.toLocaleString('en-US', options);
    }
  }

  /**
   * Sets the current status to display.
   */
  async setCurrentStatus(){
    if(this.currentTimesheetIndex != -1){
      this.currentStatus = this.timesheets[this.currentTimesheetIndex].status.toString();
    }
  }

  /**
   * Submits the current timesheet.
   */
  async submit(): Promise<Timesheet>{
    let tempSheet: Timesheet = null;

    return await this.getCurrentTimesheet().then(
      (data)=>{
        const url = data._links["submit"];

        return this.putTimesheetRequest(data,tempSheet,url).then((data)=>{
         tempSheet = data;
          return tempSheet;
       });
      });
  }

  /**
   * Does a PUT for the specified timesheet.
   * @param data The data to be sent as the body of the request.
   * @param tempSheet The timesheet to set the response to, as well as return.
   * @param url The PUT url for the timesheet..
   */
  async putTimesheetRequest(data:any, tempSheet: Timesheet, url: string[]): Promise<Timesheet>{
    await this.http.put<Timesheet>(url["href"],data, httpOptions).toPromise().then(response => {
      tempSheet = response;
      return response;
    }).catch(() => {
      return null;
    });

    return tempSheet;
  }

  /**
   * Gets the earliest date for selection from the date picker.
   */
  async getEarliestDate(){
     let promise = new Promise((resolve, reject)=>{
       resolve(this.timesheets[this.timesheets.length-1].startDate);
     });

     return await promise;
  }

  /**
   * Gets the specified timesheet.
   * @param timesheetId The ID of the timesheet to get.
   */
  getTimesheetById(timesheetId:number):Observable<Timesheet>{
    return this.http.get(`http://localhost:8080/timesheets/${timesheetId}`).pipe(map((response:Response) => response))
      .pipe(map((data: any) => {
        return data as Timesheet;
      }));
  }
}
