import { HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { AuthService } from "../auth/auth.service";
import { catchError, throwError } from "rxjs";

export const tokenExpiredInterceptor: HttpInterceptorFn = (req, next) => {
    const authService = inject(AuthService);

    return next(req).pipe(
        catchError(error => {

        if (error.status === 401) {
            authService.logout();
        }

        return throwError(() => error);
        })
    );
};