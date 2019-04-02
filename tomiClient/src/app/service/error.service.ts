import {Injectable} from '@angular/core';
import {MatSnackBar, MatSnackBarRef} from "@angular/material";
import {Observable, of} from "rxjs";
import {Injector} from '@angular/core';

const MESSAGE: string = 'Oopsie Doopsie, Something went Poopsie!';

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
  public displayErrorMessage(extraInfo: string){
    this.displayError();
  }

}
