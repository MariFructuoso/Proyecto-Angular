import { Routes } from '@angular/router';
import { loginActivateGuard } from './shared/guards/auth.guard'; 
import { leavePageGuard } from './shared/guards/leave-page-guard';

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
    path: 'properties/add', 
    loadComponent: () => import('./properties/property-form/property-form').then(m => m.PropertyForm),
    canActivate: [loginActivateGuard], 
    canDeactivate: [leavePageGuard]   
  },
  {
    path: 'properties/edit/:id',
    loadComponent: () => import('./properties/property-form/property-form').then(m => m.PropertyForm),
    canActivate: [loginActivateGuard],
    canDeactivate: [leavePageGuard]    
  },

  {
    path: 'profile',
    loadComponent: () => import('./profile/profile-page/profile-page').then(m => m.ProfilePage),
    canActivate: [loginActivateGuard]
  },
  {
    path: 'profile/:id',
    loadComponent: () => import('./profile/profile-page/profile-page').then(m => m.ProfilePage),
    canActivate: [loginActivateGuard]
  },

  { path: '', redirectTo: '/auth/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/auth/login' },
];