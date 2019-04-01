import {Injectable} from '@angular/core';
import {MatSnackBar, MatSnackBarVerticalPosition} from "@angular/material";
import {Observable, of, throwError} from "rxjs";
import {HttpErrorResponse} from "@angular/common/http";


const message: string = 'Oopsie Poopsie!';

@Injectable({
  providedIn: 'root'
})

export class ErrorService {

  constructor(private snackBar: MatSnackBar) {
  }

  // public handleError(error: HttpErrorResponse) {
  //   if (error.error instanceof ErrorEvent) {
  //     // A client-side or network error occurred. Handle it accordingly.
  //     console.log('A handleError error occurred:', error.error.message);
  //   } else {
  //     // The backend returned an unsuccessful response code.
  //     // The response body may contain clues as to what went wrong,
  //     console.log(
  //       `handleeError - Backend returned code ${error.status}, ` +
  //       `body was: ${error.error}`);
  //   }
  //   // return an observable with a user-facing error message
  //  // return throwError(
  //    // 'handleError - -Something bad happened; please try again later.');
  // };

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
}
