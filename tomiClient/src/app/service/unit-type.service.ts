import {Injectable} from '@angular/core';
import {catchError, map} from "rxjs/operators";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {UnitType} from "../model/unitType";
import {BehaviorSubject, Observable} from "rxjs";
import {unitTypeUrl} from "../configuration/domainConfiguration";
import {MatSnackBar} from "@angular/material";
import {ErrorService} from "./error.service";

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

/**
 * UnitTypeService is used to control the flow of data regarding unit types to/from the view.
 *
 * @author Iliya Kiritchkov
 * @version 1.1
 */
@Injectable({
  providedIn: 'root'
})
export class UnitTypeService {

  /** The list of all active UnitTypes. */
  unitTypes: BehaviorSubject<Array<UnitType>> = new BehaviorSubject<Array<UnitType>>([]);

  constructor(private http: HttpClient, public snackBar: MatSnackBar, private errorService: ErrorService) {
  }

  /**
   * Gets the list of all active unit types and populates them into the unitTypes list.
   */
  initializeUnitTypes() {
    return this.getAllUnitTypes().forEach(unitTypes => {
      this.unitTypes = new BehaviorSubject<Array<UnitType>>(unitTypes);
      this.sortUnitTypes();
    }).catch(() => {
      this.errorService.displayErrorMessage(
        'Something went wrong when getting the list unit types. Please contact your system administrator.')
    });
  }

  /**
   * Sorts the UnitTypes in the unitTypes list by ascending name.
   */
  sortUnitTypes() {
    this.unitTypes.getValue().sort((unit1, unit2) => {
      let name1 = unit1.name.toLowerCase();
      let name2 = unit2.name.toLowerCase();
      if (name1 > name2) {
        return 1;
      }
      if (name1 < name2) {
        return -1;
      }
      return 0;
    });
  }

  /**
   * Sends a GET message to the server to retrieve all active UnitTypes.
   */
  getAllUnitTypes() {
    let obsUnitTypes: Observable<Array<UnitType>>;
    obsUnitTypes = this.http.get(unitTypeUrl)
      .pipe(map((data: any) => {
      return data._embedded.unitTypes as UnitType[];
    }));
    return obsUnitTypes;
  }

  /**
   * Logically deletes the unit type (sets the active status to false).
   *
   * @param unitType the UnitType to be deleted.
   */
  deleteUnitType(unitType: UnitType) {
    const url = unitType._links["delete"];
    this.http.delete(url["href"], httpOptions).toPromise().then((response) => {
      this.initializeUnitTypes();
      let deleteUnitTypeSuccessMessage = unitType.name + ' deleted successfully.';
      this.snackBar.open(deleteUnitTypeSuccessMessage, null, {
        duration: 4000,
        politeness: 'assertive',
        panelClass: 'snackbar-success',
        horizontalPosition: 'right'
      });
    }).catch(() => {
      this.errorService.displayErrorMessage('Something went wrong when deleting')
    });
  }

  /**
   * Saves the specified UnitType. If the UnitType is new (id = -1), an HTTP POST is performed,
   * else an HTTP PUT is performed to update the existing UnitType.
   *
   * @param unitType The UnitType to be created/updated.
   */
  async saveUnitType(unitType: UnitType) {
    if (unitType.id === -1) {
      await this.http.post<UnitType>(unitTypeUrl, JSON.stringify(unitType), httpOptions).toPromise().then(response => {
        this.initializeUnitTypes();
        let addUnitTypeSucessMessage = unitType.name + ' added successfully.';
        this.snackBar.open(addUnitTypeSucessMessage, null, {
          duration: 4000,
          politeness: 'assertive',
          panelClass: 'snackbar-success',
          horizontalPosition: 'right'
        });
      }).catch(() => {
        this.errorService.displayErrorMessage('Something went wrong when adding')
      });
    } else {
      const url = unitType._links["update"];
      await this.http.put<UnitType>(url["href"],
        JSON.stringify(unitType), httpOptions)
        .toPromise()
        .then(() => {
          this.initializeUnitTypes();
          let editUnitTypeSucessMessage = 'Updated successfully.';
          this.snackBar.open(editUnitTypeSucessMessage, null, {
            duration: 4000,
            politeness: 'assertive',
            panelClass: 'snackbar-success',
            horizontalPosition: 'right'
          });
        }).catch(() => {
          this.errorService.displayErrorMessage('Something went wrong when updating')
        });
    }
  }

  /**
   * Sends a GET message to the server to retrieve the UnitType by their ID.
   *
   * @param id ID of the unit type.
   */
  getUnitTypeById(id: number) {
    return this.http.get(`${unitTypeUrl}/${id}`)
      .pipe(catchError(this.errorService.handleError()))
      .pipe(map((data: any) => {
        if (data !== undefined) {
          return data as UnitType;
        } else {
          return null;
        }
      }));
  }

  /**
   * Returns a reference to unitTypes list.
   */
  getUnitTypeSubjectList(): BehaviorSubject<Array<UnitType>> {
    return this.unitTypes;
  }
}
