import { Injectable } from '@angular/core';
import {map} from "rxjs/operators";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {UnitType} from "../model/unitType";
import {BehaviorSubject} from "rxjs";

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
    this.GETAllUnitTypes().forEach(unitTypes => {
      this.unitTypes = new BehaviorSubject<Array<UnitType>>(unitTypes);
    });
  }

  /**
   * Sends a GET message to the server for a fresh list of all UnitTypes.
   */
  GETAllUnitTypes() {
    return this.http.get(this.unitTypeUrl).pipe(map((response:Response) =>
      response)).pipe(map((data: any) => {
      return data._embedded.unitTypes as UnitType[];
    }));
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

  async saveUnitType(unitTypeToSave: UnitType) {
    if (unitTypeToSave.id === -1) {
      await this.http.post<UnitType>(this.unitTypeUrl, JSON.stringify(unitTypeToSave), httpOptions).toPromise().then(response => {
        this.refreshUnitTypes();
      });
    } else {
      const url = unitTypeToSave._links["update"];
      this.http.put<UnitType>(url["href"], JSON.stringify(unitTypeToSave), httpOptions).toPromise().then(response => {
        this.refreshUnitTypes();
      });
    }
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
    let freshUnitTypes = this.GETAllUnitTypes();

    freshUnitTypes.forEach(freshUnitTypes => {
      freshUnitTypes.forEach( freshUnitType => {
        let index = this.unitTypes.getValue().findIndex((staleUnitType) => {
          return (staleUnitType.id === freshUnitType.id);
        });

        // If the Id of the UnitType didn't match any of the existing Ids then it will be added to the list.
        if (index === -1) {
          this.unitTypes.getValue().push(freshUnitType);

          // If the Id was found, then the stale Unit Type will be replaced with fresh data.
        } else {
          this.unitTypes.getValue().splice(index, 1, freshUnitType);
        }

      });
    });

    //Check for any deleted UnitTypes
    this.unitTypes.getValue().forEach(staleUnitType => {

      freshUnitTypes.forEach(freshUnitTypes => {
        let index = freshUnitTypes.findIndex((freshUnitType) => {
          return (freshUnitType.id === staleUnitType.id);
        });

        //If the Id was not found then the UnitType has been deleted and is removed from the list.
        if (index === -1) {
          let indexToBeRemoved = this.unitTypes.getValue().findIndex((unitTypeToBeRemoved) => {
            return (unitTypeToBeRemoved.id === staleUnitType.id);
          });

          this.unitTypes.getValue().splice(indexToBeRemoved, 1);
        }
      });
    });
  }
}
