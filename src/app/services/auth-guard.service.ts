import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {
  user = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.authService.user.subscribe(res => {
      this.user = res;
    });
  }

  async canActivate(snapshot: ActivatedRouteSnapshot) {
    if (this.user) {
      return true;
    } else {
      this.router.navigate(['login']);
      return false;
    }
  }
}
