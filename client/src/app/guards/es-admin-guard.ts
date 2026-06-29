import { CanActivateFn, Router } from '@angular/router';
import { AuthStateService } from '../auth/auth-state.service';
import { inject } from '@angular/core';

export const esAdminGuard: CanActivateFn = (route, state) => {
  
  const authService = inject(AuthStateService);
  const router = inject(Router);

  if (authService.usuario()?.role === 'administrador') {
    return true;
  }

  return router.createUrlTree(['']);
};
