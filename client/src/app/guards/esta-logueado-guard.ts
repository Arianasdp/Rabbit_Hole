import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

export const estaLogueadoGuard: CanActivateFn = async (route, state) => {
  
  const authService = inject(AuthService);
  const router = inject(Router);

    if (authService.isLoggedIn()) {

      return true;
    }
    else {

      return router.createUrlTree(['/auth/login']);
    }
};
