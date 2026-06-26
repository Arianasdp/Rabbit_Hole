import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthStateService } from '../auth/auth-state.service';

export const estaLogueadoGuard: CanActivateFn = async (route, state) => {
  
  const authService = inject(AuthStateService);
  const router = inject(Router);

    if (authService.isLoggedIn()) {

      return true;
    }
    else {

      return router.createUrlTree(['/auth/login']);
    }
};
