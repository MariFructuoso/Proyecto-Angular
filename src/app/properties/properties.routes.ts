import { Routes } from "@angular/router";
import { leavePageGuard } from "../shared/guards/leave-page-guard";
import { numericIdGuard } from "../shared/guards/numeric-id-guard";

export const propertiesRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./properties-page/properties-page').then((m) => m.PropertiesPage),
    title: 'Inmosanvi | Angular Inmosanvi',
  },
  {
    path: 'add',
    canDeactivate: [leavePageGuard],
    loadComponent: () => import('./property-form/property-form').then((m) => m.PropertyForm),
    title: 'Add Inmosanvi | Angular Inmosanvi',
  },
  {
    path: ':id',
    canActivate: [numericIdGuard],
    loadComponent: () => import('./property-detail/property-detail').then((m) => m.PropertyDetail),
  },
];
