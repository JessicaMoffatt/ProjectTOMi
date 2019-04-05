import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";
import {catchError, map} from "rxjs/operators";
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
import {ErrorService} from "./error.service";

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
  /** The list of all timehseets for this user.*/
  timesheets: Timesheet[] = [];

  /** List of all projects this user is allowed to access.*/
  projects: Project[] = [];

  /** List of all tasks.*/
  tasks: BehaviorSubject<Array<Task>> = new BehaviorSubject<Array<Task>>([]);
  /** List of all unit types.*/
  unitTypes: BehaviorSubject<Array<UnitType>> = new BehaviorSubject<Array<UnitType>>([]);

  /** The position in timesheets for the current timesheet.*/
  private currentTimesheetIndex = 0;

  /** The starting date for the current timesheet.*/
  public currentDate;

  /** The status of the current timesheet.*/
  public currentStatus = "";

  /**
   * The earliest date that can be selectedProject.
   */
  minDate: Date;

  private repopulateTimesheets: boolean = false;

  constructor(private http: HttpClient, public taskService: TaskService, public unitTypeService: UnitTypeService,
              private errorService: ErrorService) {
  }

  /** Populates tasks.*/
  async populateTasks() {
    let promise = new Promise((resolve) => {
      resolve(this.taskService.initializeTasks())
    }).then(() => {
      this.tasks = this.taskService.getTaskSubjectList();
    }).catch(() => this.errorService.displayError());

    return await promise;
  }

  /** Populates unitTypes.*/
  async populateUnitTypes() {
    let promise = new Promise((resolve) => {
      resolve(this.unitTypeService.initializeUnitTypes())
    }).then(() => {
      this.unitTypes = this.unitTypeService.getUnitTypeSubjectList();
    }).catch(() => this.errorService.displayError());

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
    }).catch(() => this.errorService.displayError())
  }

  /**
   * Gets all entries for the specified timesheet.
   * @param timesheet the timesheet to get entries for
   */
  getEntries(timesheet: Timesheet): Observable<Array<Entry>> {
    let url = timesheet._links["getEntries"];
    return this.http.get(url["href"])
      .pipe(catchError(this.errorService.handleError()))
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
   * Gets the current timesheet.
   */
  async getCurrentTimesheet(): Promise<Timesheet> {
    if (this.currentTimesheetIndex != -1) {
      return this.timesheets[this.currentTimesheetIndex];
    } else return null;
  }

  /**
   * Gets all timesheets for the specified user.
   * @param userId The ID of the user.
   */
  async getAllTimesheets(userId: number) {
    return this.http.get(`${userTimesheetUrl}/${userId}`)
      .pipe(catchError(this.errorService.handleError()))
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
      return response.toPromise()
        .then((data) => {
          this.timesheets = data;

          if (this.currentTimesheetIndex >= this.timesheets.length) {
            this.currentTimesheetIndex = this.timesheets.length - 1;
          }

          return this.getCurrentTimesheet();
        }).catch(() => this.errorService.displayError())
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

  async updateTimesheet(timesheet: Timesheet) {
    return this.timesheets[this.currentTimesheetIndex] = timesheet;
  }

  setRepopulateTimesheets(reset: boolean) {
    this.repopulateTimesheets = reset;
  }

  getRepopulateTimesheets(): boolean {
    return this.repopulateTimesheets;
  }

  /**
   * Submits the current timesheet.
   */
  async submit(): Promise<Timesheet> {
    let tempSheet: Timesheet = null;

    return await this.getCurrentTimesheet()
      .then((data) => {
        let url = data._links["submit"];

        return this.putTimesheetRequest(data, tempSheet, url)
          .then((data) => {
            tempSheet = data;
            return tempSheet;
          })
      })
  }

  /**
   * Does a PUT for the specified timesheet.
   * @param data The data to be sent as the body of the request.
   * @param tempSheet The timesheet to set the response to, as well as return.
   * @param url The PUT url for the timesheet..
   */
  async putTimesheetRequest(data: any, tempSheet: Timesheet, url: string[]): Promise<Timesheet> {
    await this.http.put<Timesheet>(url["href"], data, httpOptions).toPromise()
      .then(response => {
        tempSheet = response;
        return response;
      }).catch(() => {
        this.errorService.displayError();
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
   * Gets the specified timesheet.
   * @param timesheetId The ID of the timesheet to get.
   */
  getTimesheetById(timesheetId: number): Observable<Timesheet> {
    return this.http.get(`${timesheetUrl}/${timesheetId}`)
      .pipe(catchError(this.errorService.handleError()))
      .pipe(map((data: any) => {
        return data as Timesheet;
      }));
  }
}
