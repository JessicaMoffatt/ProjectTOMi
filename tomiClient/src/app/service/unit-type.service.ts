import {Injectable} from '@angular/core';
import {map} from "rxjs/operators";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {UnitType} from "../model/unitType";
import {BehaviorSubject, Observable} from "rxjs";
import {unitTypeUrl} from "../configuration/domainConfiguration";
import {MatSnackBar} from "@angular/material";
import {Task} from "../model/task";

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

  constructor(private http: HttpClient, public snackBar: MatSnackBar) {

  }

  /**
   * Get the list of all active unit types and populate into the unitTypes list.
   */
  initializeUnitTypes() {
   return this.GETAllUnitTypes().forEach(unitTypes => {
      this.unitTypes = new BehaviorSubject<Array<UnitType>>(unitTypes);
      this.sortUnitTypes();
    }).catch((error: any) => {
      let getUnitTypesErrorMessage = 'Something went wrong when getting the list unit types. Please contact your system administrator.';
      this.snackBar.open(getUnitTypesErrorMessage, null, {
        duration: 5000,
        politeness: 'assertive',
        panelClass: 'snackbar-fail',
        horizontalPosition: 'right'
      });
    });
  }

  /**
   * Sorts the unit types in the unitTypes list by ascending name.
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
   * Sends a GET message to the server for a fresh list of all UnitTypes.
   */
  GETAllUnitTypes() {
    let obsUnitTypes: Observable<Array<UnitType>>;
    obsUnitTypes = this.http.get(unitTypeUrl).pipe(map((response: Response) =>
      response)).pipe(map((data: any) => {
      return data._embedded.unitTypes as UnitType[];
    }));
    return obsUnitTypes;
  }

  /**
   * Logically deletes the unit type (sets the active status to false).
   *
   * @param unitTypeToDelete the UnitType to be deleted.
   */
  DELETEUnitType(unitTypeToDelete: UnitType) {
    const url = unitTypeToDelete._links["delete"];
    this.http.delete(url["href"], httpOptions).toPromise().then((response) => {
      this.refreshUnitTypes();
      let deleteUnitTypeSuccessMessage = unitTypeToDelete.name + ' deleted successfully.';
      this.snackBar.open(deleteUnitTypeSuccessMessage, null, {
        duration: 4000,
        politeness: 'assertive',
        panelClass: 'snackbar-success',
        horizontalPosition: 'right'
      });
    }).catch((error: any) => {
      let deleteUnitTypeErrorMessage = 'Something went wrong when deleting ' + unitTypeToDelete.name + '. Please contact your system administrator.';
      this.snackBar.open(deleteUnitTypeErrorMessage, null, {
        duration: 5000,
        politeness: 'assertive',
        panelClass: 'snackbar-fail',
        horizontalPosition: 'right'
      });
    });
  }

  /**
   *
   * @param unitTypeToSave
   */
  async saveUnitType(unitTypeToSave: UnitType) {
    if (unitTypeToSave.id === -1) {
      await this.http.post<UnitType>(unitTypeUrl, JSON.stringify(unitTypeToSave), httpOptions).toPromise().then(response => {
        this.refreshUnitTypes();
        let addUnitTypeSucessMessage = unitTypeToSave.name + ' added successfully.';
        this.snackBar.open(addUnitTypeSucessMessage, null, {
          duration: 4000,
          politeness: 'assertive',
          panelClass: 'snackbar-success',
          horizontalPosition: 'right'
        });
      }).catch((error: any) => {
        let addUnitTypeErrorMessage = 'Something went wrong when adding ' + unitTypeToSave.name + '. Please contact your system administrator.';
        this.snackBar.open(addUnitTypeErrorMessage, null, {
          duration: 5000,
          politeness: 'assertive',
          panelClass: 'snackbar-fail',
          horizontalPosition: 'right'
        });
      });
    } else {
      const url = unitTypeToSave._links["update"];
      await this.http.put<UnitType>(url["href"],
        JSON.stringify(unitTypeToSave), httpOptions)
        .toPromise()
        .then(response => {
          this.refreshUnitTypes();
          let editUnitTypeSucessMessage = unitTypeToSave.name + ' updated successfully.';
          this.snackBar.open(editUnitTypeSucessMessage, null, {
            duration: 4000,
            politeness: 'assertive',
            panelClass: 'snackbar-success',
            horizontalPosition: 'right'
          });
        }).catch((error: any) => {
          let editUnitTypeFailMessage = 'Something went wrong when updating ' + unitTypeToSave.name + '. Please contact your system administrator.';
          this.snackBar.open(editUnitTypeFailMessage, null, {
            duration: 5000,
            politeness: 'assertive',
            panelClass: 'snackbar-fail',
            horizontalPosition: 'right'
          });
        });
    }
  }

  /**
   * Returns a Unit Type by passing in it's id.
   *
   * @param id id of the unit type.
   */
  getUnitTypeById(id: number) {
    return this.http.get(`${unitTypeUrl}/${id}`).pipe(map((response: Response) => response))
      .pipe(map((data: any) => {
        if (data !== undefined) {
          return data as UnitType;
        } else {
          return null;
        }
      }));
  }

  /**
   * Refresh the List of UnitTypes to keep up-to-date with the server.
   */
  refreshUnitTypes() {
    let freshUnitTypes: UnitType[];

    this.GETAllUnitTypes().forEach(unitTypes => {
      freshUnitTypes = unitTypes;

      //Replace all unit types with fresh unit type data
      freshUnitTypes.forEach(freshUnitType => {
        let index = this.unitTypes.getValue().findIndex((staleUnitType) => {
          return (staleUnitType.id === freshUnitType.id);
        });

        //If the id didn't match any of the existing ids then add it to the list.
        if (index === -1) {
          this.unitTypes.getValue().push(freshUnitType);

          // id was found and this UnitType will be replaced with fresh data
        } else {
          this.unitTypes.getValue().splice(index, 1, freshUnitType);
        }
      });

      //Check for any deleted UnitTypes
      this.unitTypes.getValue().forEach(oldUnitType => {
        let index = freshUnitTypes.findIndex(newUnitType => {
          return (newUnitType.id === oldUnitType.id);
        });

        if (index === -1) {
          let indexToBeRemoved = this.unitTypes.getValue().findIndex((unitTypeToBeRemoved) => {
            return (unitTypeToBeRemoved.id === oldUnitType.id);
          });

          this.unitTypes.getValue().splice(indexToBeRemoved, 1);
        }
      });
    }).then(value => {
      this.sortUnitTypes();
    }).catch((error: any) => {
      let getUnitTypeErrorMessage = 'Something went wrong when updating the list of Unit Types. Please contact your system administrator.';
      this.snackBar.open(getUnitTypeErrorMessage, null, {
        duration: 5000,
        politeness: 'assertive',
        panelClass: 'snackbar-fail',
        horizontalPosition: 'right'
      });
    });
  }

  getUnitTypeSubjectList(): BehaviorSubject<Array<UnitType>> {
    return this.unitTypes;
  }
}
