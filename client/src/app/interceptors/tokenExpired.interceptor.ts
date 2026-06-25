import { HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { catchError, throwError } from "rxjs";
import { Router } from "@angular/router";

export const tokenExpiredInterceptor: HttpInterceptorFn = (req, next) => {
    const router = inject(Router);

    return next(req).pipe(
        catchError(error => {

        if (error.status === 401) {
            console.log("entramos al interceptor");
            localStorage.removeItem('token');
            router.navigateByUrl('/auth/login');
        }

        return throwError(() => error);
        })
    );
};