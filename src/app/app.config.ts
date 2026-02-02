import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { PreloadAllModules, provideRouter, withComponentInputBinding, withPreloading } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { baseUrlInterceptor } from './shared/interceptors/base-url-interceptor';
import { provideSignalFormsConfig, SignalFormsConfig } from '@angular/forms/signals';

export const NG_STATUS_CLASSES: SignalFormsConfig['classes'] = {
  'ng-touched': ({state}) => state().touched(),
  'ng-untouched': ({state}) => !state().touched(),
  'ng-dirty': ({state}) => state().dirty(),
  'ng-pristine': ({state}) => !state().dirty(),
  'ng-valid': ({state}) => state().valid(),
  'ng-invalid': ({state}) => state().invalid(),
  'ng-pending': ({state}) => state().pending(),
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withInterceptors([baseUrlInterceptor])),
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes, withComponentInputBinding(), withPreloading(PreloadAllModules)),
    provideSignalFormsConfig({
      classes: NG_STATUS_CLASSES,
    }),
  ],
};
