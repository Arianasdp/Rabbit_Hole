import { HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { catchError, throwError } from "rxjs";
import { Router } from "@angular/router";
import { AuthService } from "../auth/auth.service";

export const tokenExpiredInterceptor: HttpInterceptorFn = (req, next) => {
    const router = inject(Router);
    const authService = inject(AuthService);

    return next(req).pipe(
        catchError(error => {

            if (error.status === 401) {

                localStorage.removeItem('token');

                authService.usuario.set(null);

                router.navigateByUrl('/auth/login')
                    .then(res => console.log('resultado navigate', res));

            }

            return throwError(() => error);
        })
    );
};