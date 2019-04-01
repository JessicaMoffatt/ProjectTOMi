import {Injectable} from '@angular/core';
import {MatSnackBar} from "@angular/material";
import {Observable, of} from "rxjs";


const message: string = 'Oopsie Poopsie!';

@Injectable({
  providedIn: 'root'
})

export class ErrorService {

  constructor(private snackBar: MatSnackBar) {
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  public handleError<T>(result?: T) {

    return (error: any): Observable<T> => {
      this.snackBar.open(message, null, {
        duration: 5000,
        politeness: 'assertive',
        panelClass: 'snackbar-fail',
        horizontalPosition: 'right',
        verticalPosition: 'top'
      });

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  public displayError() {
    this.snackBar.open(message, null, {
      duration: 5000,
      politeness: 'assertive',
      panelClass: 'snackbar-fail',
      horizontalPosition: 'right',
      verticalPosition: 'top'
    });
  }
}
