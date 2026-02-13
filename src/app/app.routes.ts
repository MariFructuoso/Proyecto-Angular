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
  
  {
    path: 'properties/edit/:id',
    loadComponent: () => import('./properties/property-form/property-form').then(m => m.PropertyForm)
  },

  { path: '', redirectTo: '/auth/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/auth/login' },
];