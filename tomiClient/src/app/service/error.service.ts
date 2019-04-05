import {Injectable} from '@angular/core';
import {MatSnackBar} from "@angular/material";
import {Observable, of} from "rxjs";

const MESSAGE: string = 'The requested operation is unavailable.  Please try again later.';

@Injectable({
  providedIn: 'root'
})


export class ErrorService {

  constructor(private snackBar: MatSnackBar){}


  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param result - optional value to return as the observable result
   */
  public handleError<T>(result?: T) {
    return (): Observable<T> => {
      this.displayError();
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

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
   * This method allows the caller to pass an extra info parameter
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
