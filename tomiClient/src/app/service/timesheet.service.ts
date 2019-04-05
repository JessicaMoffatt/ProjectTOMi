import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";
import {map} from "rxjs/operators";
import {Entry} from "../model/entry";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Timesheet} from "../model/timesheet";
import {timesheetUrl} from "../configuration/domainConfiguration";
import {userTimesheetUrl} from "../configuration/domainConfiguration";
import {Project} from "../model/project";
import {Task} from "../model/task";
import {UnitType} from "../model/unitType";
import {TaskService} from "./task.service";
import {UnitTypeService} from "./unit-type.service";

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
  /** The list of all timesheets for this user.*/
  timesheets: Timesheet[] = [];

  /** List of all projects this user is allowed to access.*/
  projects: Project[] = [];

  /** List of all tasks.*/
  tasks: BehaviorSubject<Array<Task>> = new BehaviorSubject<Array<Task>>([]);

  /** List of all unit types.*/
  unitTypes: BehaviorSubject<Array<UnitType>> = new BehaviorSubject<Array<UnitType>>([]);

  /** The position in timesheets for the current Timesheet.*/
  private currentTimesheetIndex = 0;

  /** The starting date for the current Timesheet.*/
  public currentDate;

  /** The status of the current Timesheet.*/
  public currentStatus = "";

  /**
   * The earliest date that can be selected.
   */
  minDate: Date;

  /** Represents whether timesheets should be repopulated on init or not. */
  private repopulateTimesheets: boolean = false;

  constructor(private http: HttpClient, public taskService: TaskService, public unitTypeService: UnitTypeService) {
  }

  /** Populates tasks with list of Tasks.*/
  async populateTasks() {
    let promise = new Promise((resolve) => {
      resolve(this.taskService.initializeTasks())
    }).then(() => {
      this.tasks = this.taskService.getTaskSubjectList();
    });

    return await promise;
  }

  /** Populates unitTypes with list of UnitTypes.*/
  async populateUnitTypes() {
    let promise = new Promise((resolve) => {
      resolve(this.unitTypeService.initializeUnitTypes())
    }).then(() => {
      this.unitTypes = this.unitTypeService.getUnitTypeSubjectList();
    });

    return await promise;
  }

  /**
   * Returns the current timesheet index.
   */
  getCurrentTimesheetIndex() {
    return this.currentTimesheetIndex;
  }

  /**
   * Asynchronously sets the current timesheet index to the specified number.
   * @param index The number to set the index to.
   */
  async setCurrentTimesheetIndex(index: number) {
    this.currentTimesheetIndex = index;
    return this.currentTimesheetIndex;
  }

  /**
   * Determines if the minimum date should be set.
   */
  doSetMinDate() {
    if (this.minDate === undefined || this.minDate === null) {
      this.setMinDate().then();
    }
  }

  /**
   * Sets the minimum date accordingly.
   */
  async setMinDate() {
    await this.getEarliestDate().then((data) => {
      let dateString = data.toString().replace(/-/g, '\/').replace(/T.+/, '');

      this.minDate = new Date(dateString);
      return this.minDate;
    });
  }

  /**
   * Sends a GET message to the server to retrieve all Entries for the specified Timesheet.
   * @param id The ID of the Timesheet.
   */
  getEntries(timesheet: Timesheet): Observable<Array<Entry>> {
    let url = timesheet._links["getEntries"];
    return this.http.get(url["href"])
      .pipe(map((data: any) => {
        if (data._embedded !== undefined) {
          let sorted = data._embedded.entries as Entry[];
          sorted = sorted.sort((entry1, entry2) => entry1.id - entry2.id);
          return sorted;
        } else {
          return [];
        }
      }));
  }

  /**
   * Gets the current Timesheet.
   */
  async getCurrentTimesheet(): Promise<Timesheet> {
    if (this.currentTimesheetIndex != -1) {
      return this.timesheets[this.currentTimesheetIndex];
    } else return null;
  }

  /**
   * Sends a GET message to the server to retrieve all Timesheets for the specified user.
   * @param userId The ID of the user.
   */
  async getAllTimesheets(userId: number) {
    return this.http.get(`${userTimesheetUrl}/${userId}`)
      .pipe(map((data: any) => {
        if (data._embedded !== undefined) {
          return data._embedded.timesheets as Timesheet[];
        } else {
          return [];
        }
      }));
  }

  /**
   * Populates timesheets for the specified user.
   * @param userId The ID of the user the get timesheets for.
   */
  async populateTimesheets(userId: number) {
    return await this.getAllTimesheets(userId).then((response) => {
      return response.toPromise().then((data) => {
        this.timesheets = data;

        if (this.currentTimesheetIndex >= this.timesheets.length) {
          this.currentTimesheetIndex = this.timesheets.length - 1;
        }

        return this.getCurrentTimesheet();
      });
    });
  }

  /**
   * Sets the current date to display.
   */
  setCurrentDate() {
    // force LOCAL time with +'T00:00:00'
    if (this.currentTimesheetIndex != -1) {
      let tempDay = new Date(this.timesheets[this.currentTimesheetIndex].startDate + 'T00:00:00');
      let options = {
        year: 'numeric', month: 'long', day: 'numeric'
      };

      this.currentDate = tempDay.toLocaleString('en-US', options);
    }
  }

  /**
   * Sets the current status to display.
   */
  async setCurrentStatus() {
    if (this.currentTimesheetIndex != -1) {
      this.currentStatus = this.timesheets[this.currentTimesheetIndex].status.toString();
      return this.currentStatus;
    } else {
      return this.currentStatus;
    }
  }

  /**
   * Updates the Timesheet at the current timesheet index to the specified Timesheet.
   * @param timesheet The Timesheet to replace the Timesheet located at the current timesheet index with.
   */
  async updateTimesheet(timesheet: Timesheet) {
    return this.timesheets[this.currentTimesheetIndex] = timesheet;
  }

  /** Sets repopulateTimesheets to the specified value.*/
  setRepopulateTimesheets(reset: boolean) {
    this.repopulateTimesheets = reset;
  }

  /** Returns the value of repopulateTimesheets.*/
  getRepopulateTimesheets(): boolean {
    return this.repopulateTimesheets;
  }

  /**
   * Submits the current Timesheet.
   */
  async submit(): Promise<Timesheet> {
    let tempSheet: Timesheet = null;

    return await this.getCurrentTimesheet().then(
      (data) => {
        let url = data._links["submit"];

        return this.putTimesheetRequest(data, tempSheet, url).then((data) => {
          tempSheet = data;
          return tempSheet;
        });
      });
  }

  /**
   * Does a PUT request for the specified Timesheet.
   * @param data The data to be sent as the body of the request.
   * @param tempSheet The Timesheet to set the response to, as well as return.
   * @param url The PUT url for the Timesheet.
   */
  async putTimesheetRequest(data: any, tempSheet: Timesheet, url: string[]): Promise<Timesheet> {
    await this.http.put<Timesheet>(url["href"], data, httpOptions).toPromise().then(response => {
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
  async getEarliestDate() {
    let promise = new Promise((resolve) => {
      resolve(this.timesheets[this.timesheets.length - 1].startDate);
    });

    return await promise;
  }

  /**
   * Sends a GET message to the server to retrieve the Timesheets by their ID.
   * @param timesheetId The ID of the Timesheet to get.
   */
  getTimesheetById(timesheetId: number): Observable<Timesheet> {
    return this.http.get(`${timesheetUrl}/${timesheetId}`)
      .pipe(map((data: any) => {
        return data as Timesheet;
      }));
  }
}
