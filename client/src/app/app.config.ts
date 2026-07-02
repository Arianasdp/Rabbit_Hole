import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './interceptors/httpinterceptor.interceptor';
import { tokenExpiredInterceptor } from './interceptors/tokenExpired.interceptor';
import { provideServiceWorker } from '@angular/service-worker';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([authInterceptor, tokenExpiredInterceptor])
    ),
    provideServiceWorker('ngsw-worker.js', {
      enabled: true
    })
  ]
};
