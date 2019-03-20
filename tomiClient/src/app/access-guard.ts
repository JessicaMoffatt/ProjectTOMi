import {Injectable} from "@angular/core";
import {ActivatedRouteSnapshot, CanActivate, Router} from "@angular/router";
import {Observable} from "rxjs";
import {SignInService} from "./service/sign-in.service";

@Injectable()
export class AccessGuard implements CanActivate {
  signInService:SignInService;
  router:Router;

  constructor(signInService:SignInService, router:Router){
    this.signInService = signInService;
    this.router = router;
  }
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
