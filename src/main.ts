import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { provideRouter, RouteReuseStrategy } from '@angular/router';
import { routes } from './app/app.routes';
import { HttpClientModule, provideHttpClient } from '@angular/common/http';
import { CustomReuseStrategy } from './app/services/custom-route-reuse-strategy';
import { importProvidersFrom } from '@angular/core';


bootstrapApplication(AppComponent, {
  providers: [
    // Provide the route reuse strategy
    { provide: RouteReuseStrategy, useClass: CustomReuseStrategy },
    provideRouter(routes),
    provideHttpClient() // This provides HttpClient
  ],
}).catch((err) => console.error(err));
