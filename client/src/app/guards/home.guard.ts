import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { AuthService } from "../auth/auth.service";

export const homeGuard: CanActivateFn = () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    return authService.isLoggedIn()
    ? router.createUrlTree(['/publicaciones'])
    : router.createUrlTree(['/auth/login']);
};