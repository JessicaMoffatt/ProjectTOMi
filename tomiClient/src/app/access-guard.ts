import {Injectable} from "@angular/core";
import {ActivatedRouteSnapshot, CanActivate, Router} from "@angular/router";
import {Observable} from "rxjs";
import {SignInService} from "./service/sign-in.service";

/**
 * @author Karol Talbot
 * AccessGuard is used to block access to routing if a user isn't logged in.
 * If a user isn't logged in they will be redirected to the sign in page.
 */
@Injectable()
export class AccessGuard implements CanActivate {
  signInService:SignInService;
  router:Router;

  constructor(signInService:SignInService, router:Router){
    this.signInService = signInService;
    this.router = router;
  }

  /**
   * Checks whether or not a user is logged in. If they are logged in, returns true.
   * If they are not logged in, routes them back to the sign in page and returns false.
   * @param route The route to check if it requires being logged in.
   */
  canActivate(route: ActivatedRouteSnapshot): Observable<boolean>|Promise<boolean>|boolean {
    const requiresLogin = route.data.requiresLogin || false;
    if (requiresLogin) {
      if(this.signInService.isLoggedIn().getValue()) {
        return true;
      }else{
        this.router.navigate(['/sign_in']);
        return false;
      }
    }
  }

}
