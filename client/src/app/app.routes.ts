import { Routes } from '@angular/router';
import { estaLogueadoGuard } from './guards/esta-logueado-guard';
import { authVerificationGuard } from './guards/auth-verification-guard';

export const routes: Routes = [
    {
        path: "",
        redirectTo: "publicaciones",
        pathMatch: 'full'
    },
    {
        path: "publicaciones",
        loadComponent: () => import('./pages/publicaciones/publicaciones').then((m) => m.Publicaciones),
        canActivate: [estaLogueadoGuard]
    },
    {
        path: "mi-perfil",
        loadComponent: () => import('./pages/mi-perfil/mi-perfil').then((m) => m.MiPerfil),
        canActivate: [estaLogueadoGuard]
    },
    {
        path: 'auth',
        loadChildren: () =>
            import('./auth/auth.routes').then(m => m.authRoutes),
        canActivate: [authVerificationGuard]
    },
    {
        path: "**",
        loadComponent: () => import('./pages/error-page/error-page').then((m) => m.ErrorPage)//siempre va al final, es el último caso a evaluar, si no entra a las anteriores, entra a este. Pero si se declara antes, va a frenar ahí, tipo: home, **, login y le ponés login y no lo reconoce porque frenó en el comodín (**)
    }
];
