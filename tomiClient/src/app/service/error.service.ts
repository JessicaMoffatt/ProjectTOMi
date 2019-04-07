import {Injectable} from '@angular/core';
import {MatSnackBar} from "@angular/material";
import {Observable, of} from "rxjs";

const MESSAGE: string = 'The requested operation is unavailable.  Please try again later.';

/**
 * ErrorService is used to control the displaying of error messages.
 * @author James Andrade
 */
@Injectable({
  providedIn: 'root'
})
export class ErrorService {

  constructor(private snackBar: MatSnackBar){}
  /**
   * Handles an Http operation that failed.
   * @param result An optional value to return as the observable result.
   */
  public handleError<T>(result?: T) {
    return (): Observable<T> => {
      this.displayError();
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  /**
   * Displays a generic error message.
   */
  public displayError(){
     this.snackBar.open(MESSAGE, null, {
      duration: 2000,
      politeness: 'assertive',
      panelClass: 'snackbar-fail',
      horizontalPosition: 'right',
      verticalPosition: 'top'
    });
  }

  /**
   * Displays a specified error message.
   * @param message The message to be displayed
   */
  public displayErrorMessage(message: string){
    this.snackBar.open(message, null, {
      duration: 2000,
      politeness: 'assertive',
      panelClass: 'snackbar-fail',
      horizontalPosition: 'right',
      verticalPosition: 'top'
    });
  }
}
