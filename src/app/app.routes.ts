import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.routes').then((m) => m.authRoutes),
  },
  {
    path: 'properties',
    loadChildren: () => import('./properties/properties.routes').then((m) => m.propertiesRoutes),
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' },
];
