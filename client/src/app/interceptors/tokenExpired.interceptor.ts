import { HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { catchError, throwError } from "rxjs";
import { Router } from "@angular/router";
import { TokenService } from "../auth/token.service";
import { AuthStateService } from "../auth/auth-state.service";

export const tokenExpiredInterceptor: HttpInterceptorFn = (req, next) => {
    const authState = inject(AuthStateService);
    const tokenService = inject(TokenService);
    const router = inject(Router);

    return next(req).pipe(
        catchError(error => {

            if (error.status === 401) {

                tokenService.removeToken();

                authState.usuario.set(null);
                authState.profile.set(null);

                router.navigateByUrl('/auth/login');

            }

            return throwError(() => error);
        })
    );
};