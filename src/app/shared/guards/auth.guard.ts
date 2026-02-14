import { inject } from '@angular/core';
import { Router, type CanActivateFn, UrlTree } from '@angular/router';
import { map, Observable } from 'rxjs';
import { AuthService } from '../../services/auth-service';

// 1. LoginActivateGuard
// SOLUCIÓN: Quitamos los parámetros del paréntesis. Dejamos () vacío.
export const loginActivateGuard: CanActivateFn = (): Observable<boolean | UrlTree> => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isLogged().pipe(
    map((isLogged) => {
      if (!isLogged) {
        return router.createUrlTree(['/auth/login']);
      }
      return true;
    })
  );
};

export const logoutActivateGuard: CanActivateFn = (): Observable<boolean | UrlTree> => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isLogged().pipe(
    map((isLogged) => {
      if (isLogged) {
        return router.createUrlTree(['/properties']);
      }
      return true;
    })
  );
};