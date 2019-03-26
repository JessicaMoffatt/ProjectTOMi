import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
} from '@angular/common/http';
import {Observable} from "rxjs";
import {SignInService} from "./service/sign-in.service";
import {NgModule} from "@angular/core";

/**
 * @author Karol Talbot
 */
@NgModule({
  providers: [SignInService]
})
export class AddHeaderInterceptor implements HttpInterceptor {
  signIn:SignInService;

  constructor(signIn:SignInService){
    this.signIn = signIn;
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Clone the request to add the new header
    const clonedRequest = req.clone({ headers: req.headers.set('SignIn', this.signIn.getToken()) });

    // Pass the cloned request instead of the original request to the next handle
    return next.handle(clonedRequest);
  }
}
