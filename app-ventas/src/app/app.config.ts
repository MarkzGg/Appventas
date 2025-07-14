import { ApplicationConfig, provideZoneChangeDetection} from '@angular/core';
import { routes } from './app.routes';
import { provideRouter } from '@angular/router';
import {JwtInterceptor} from  './auth/JwtInterceptor';
import {provideHttpClient, withInterceptors} from '@angular/common/http';


export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([JwtInterceptor]))
  ]
};
