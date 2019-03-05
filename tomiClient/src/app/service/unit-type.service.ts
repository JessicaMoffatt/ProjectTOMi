import { Injectable } from '@angular/core';
import {map} from "rxjs/operators";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {UnitType} from "../model/unitType";
import {BehaviorSubject, Observable} from "rxjs";

const httpOptions = {
  headers: new HttpHeaders( {
    'Content-Type': 'application/json'
  })
};

/**
 * UnitTypeService is used to provide methods for the Manage UnitTypes page.
 *
 * @author Iliya Kiritchkov
 * @version 1.1
 */
@Injectable({
  providedIn: 'root'
})
export class UnitTypeService {

  /** The link used to GET, POST and DELETE unit types. */
  private unitTypeUrl = 'http://localhost:8080/unit_types';

  /**
   * Lists all active Unit Types. This list can be subscribed to provide an always update list of Unit Types.
   */
  unitTypes: BehaviorSubject<Array<UnitType>>;

  constructor(private http: HttpClient) {

  }

  /**
   *
   */
  initializeUnitTypes() {
    this.GETAllUnitTypes().forEach(unitTypes => {
      this.unitTypes = new BehaviorSubject<Array<UnitType>>(unitTypes);
      this.sortUnitTypes();
    });
  }

  /**
   *
   */
  sortUnitTypes() {
    this.unitTypes.getValue().sort((unit1, unit2) => {
      let name1 = unit1.name.toLowerCase();
      let name2 = unit2.name.toLowerCase();
      if (name1 > name2) { return 1; }
      if (name1 < name2) { return -1; }
      return 0;
    });
  }

  /**
   * Sends a GET message to the server for a fresh list of all UnitTypes.
   */
  GETAllUnitTypes() {
    let obsUnitTypes : Observable<Array<UnitType>>;
    obsUnitTypes = this.http.get(this.unitTypeUrl).pipe(map((response:Response) =>
      response)).pipe(map((data: any) => {
      return data._embedded.unitTypes as UnitType[];
    }));
    return obsUnitTypes;
  }

  /**
   * Logically deletes the unit type (sets the active status to false).
   * @param unitTypeToDelete the UnitType to be deleted.
   */
  DELETEUnitType(unitTypeToDelete: UnitType) {
    let url = unitTypeToDelete._links["delete"];
    this.http.delete(url["href"],
      httpOptions).subscribe((response) => {
        this.refreshUnitTypes();
    });
  }

  /**
   *
   * @param unitTypeToSave
   */
  async saveUnitType(unitTypeToSave: UnitType) {
    let testUnitType: UnitType = null;

    if (unitTypeToSave.id === -1) {
      await this.http.post<UnitType>(this.unitTypeUrl, JSON.stringify(unitTypeToSave), httpOptions).toPromise().then(response => {
        this.refreshUnitTypes();
      }).catch((error: any) => {
        //TODO add a catch for the error
      });
    } else {
      const url = unitTypeToSave._links["update"];
      console.log(unitTypeToSave._links);
      await this.http.put<UnitType>(url["href"],
        JSON.stringify(unitTypeToSave), httpOptions)
        .toPromise()
        .then(response => {
        this.refreshUnitTypes();
      }).catch((error:any) => {
        //TODO add a catch for the error
      });
    }
    return testUnitType;
  }

  getUnitTypeById(id:number){
    return this.http.get(`${this.unitTypeUrl}/${id}`).pipe(map((response: Response) => response))
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
    let freshUnitTypes : UnitType[];

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
      this.unitTypes.getValue().forEach( oldUnitType => {
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
    });
  }
}
