import { Routes } from "@angular/router";

export const authRoutes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./login-page/login-page').then((m) => m.LoginPage),
    title: 'Login | Angular Inmosanvi',
  },
  { 
    path: 'register',
    loadComponent: () => import('./register-page/register-page').then((m) => m.RegisterPage),
    title: 'Register | Angular Inmosanvi',
  },
];


