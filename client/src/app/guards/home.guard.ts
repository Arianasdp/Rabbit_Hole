import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { AuthStateService } from "../auth/auth-state.service";

export const homeGuard: CanActivateFn = () => {
    const authState = inject(AuthStateService);
    const router = inject(Router);

    return authState.isLoggedIn()
    ? router.createUrlTree(['/publicaciones'])
    : router.createUrlTree(['/auth/login']);
};