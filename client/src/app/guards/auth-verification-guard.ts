import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

export const authVerificationGuard: CanActivateFn = async (route, state) => {
  
  const authService = inject(AuthService);
  const router = inject(Router);

    if (authService.isLoggedIn()) {

      return router.createUrlTree(['/publicaciones']);
    }
    else {

      return true;
    }
};
