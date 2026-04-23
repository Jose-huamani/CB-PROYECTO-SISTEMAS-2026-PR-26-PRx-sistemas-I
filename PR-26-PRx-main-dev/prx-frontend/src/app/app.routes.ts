import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./features/site/site.routes').then((module) => module.SITE_ROUTES),
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('./features/auth/presentation/auth.routes').then((module) => module.AUTH_ROUTES),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
