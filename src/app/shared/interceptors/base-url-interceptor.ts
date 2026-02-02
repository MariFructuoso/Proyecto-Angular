import { HttpInterceptorFn } from '@angular/common/http';
import { isDevMode } from '@angular/core';

export const baseUrlInterceptor: HttpInterceptorFn = (req, next) => {
  const serverUrl = isDevMode() ? 'http://localhost:3000' : 'https://miservidor.com/api-products';
  const reqClone = req.clone({
    url: `${serverUrl}/${req.url}`,
  });
  return next(reqClone);
};
