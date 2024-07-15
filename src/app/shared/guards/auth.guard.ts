import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TokenService } from '../services/token/token.service';
import { AuthService } from '../services/auth/auth.service';
import { Observable, of } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const tokenService = inject(TokenService);
  const authService = inject(AuthService);
  const router = inject(Router);

  const isLoggedIn = authService.isLoggedIn();
  const role = authService.getRole();

  // Check if the user is logged in and has the required role
  console.log('isLoggedIn', isLoggedIn);
  console.log('role', role);

  // If the user is not logged in, redirect to the login page
  if (!isLoggedIn) {
    return redirectToLogin(router);
  }

  const requiredRoles = route.data['requiredRoles'] as string[];

  if (requiredRoles) {
    const userRole = role;
    if (!userRole || !requiredRoles.some((role) => role === userRole)) {
      return redirectToUnauthorized(router);
    }
  }

  return true;
};

function redirectToLogin(router: Router): Observable<boolean> {
  // This function returns an Observable that will redirect the user to the '/login' route
  return of(router.createUrlTree(['/login'])) as any;
}

function redirectToUnauthorized(router: Router): Observable<boolean> {
  // This function returns an Observable that will redirect the user to the '/unauthorized' route
  return of(router.createUrlTree(['/unauthorized'])) as any;
}
