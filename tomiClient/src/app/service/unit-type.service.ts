import { Injectable } from '@angular/core';
import {map} from "rxjs/operators";
import {HttpClient} from "@angular/common/http";
import {UnitType} from "../model/unitType";

@Injectable({
  providedIn: 'root'
})
export class UnitTypeService {

  private unitTypeUrl = 'http://localhost:8080/unit_types';

  constructor(private http: HttpClient) { }

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
}
