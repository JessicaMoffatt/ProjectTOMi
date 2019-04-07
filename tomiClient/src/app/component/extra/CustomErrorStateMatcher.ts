import {ErrorStateMatcher} from "@angular/material";
import {FormControl, FormGroupDirective, NgForm} from "@angular/forms";

/**
 * CustomErrorStateMatcher is used for error detection of the Angular Material input fields.
 *
 * @author Iliya Kiritchkov
 * */
export class CustomErrorStateMatcher implements ErrorStateMatcher {
  /**
   * Checks if an error state has occurred within a form control.
   * @param control The control to check.
   * @param form The directive for the form.
   */
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || isSubmitted));
  }
}
