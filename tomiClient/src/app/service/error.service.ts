import {Injectable} from '@angular/core';
import {MatSnackBar} from "@angular/material";
import {Observable, of} from "rxjs";


const MESSAGE: string = 'Oopsie Doopsie, Something went Poopsie!';

@Injectable({
  providedIn: 'root'
})

export class ErrorService {

  private static snackBar: MatSnackBar;

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param result - optional value to return as the observable result
   */
  public static handleError<T>(result?: T) {
    return (): Observable<T> => {
      this.displayError();
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  public static displayError(){
    ErrorService.snackBar.open(MESSAGE, null, {
      duration: 5000,
      politeness: 'assertive',
      panelClass: 'snackbar-fail',
      horizontalPosition: 'right',
      verticalPosition: 'top'
    });
  }

  /**
   * This method allows the caller to pass an extra info parameter
   * Although it is not implemented to do anything, the intent is to allow these messages
   * to be used for troubleshooting in the future
   * @param extraInfo additional information about the error
   */
  public static displayErrorMessage(extraInfo: string){
    ErrorService.displayError();
  }

}
