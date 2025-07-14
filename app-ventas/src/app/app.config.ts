import { ApplicationConfig, provideZoneChangeDetection, provideHttpClient, withInterceptors, provideRouter } from '@angular/core';
import { routes } from './app.routes';
import { JwtInterceptor } from './auth/JwtInterceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([JwtInterceptor]))
  ]
};
