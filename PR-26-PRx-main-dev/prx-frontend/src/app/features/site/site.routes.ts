import { Routes } from '@angular/router';
import { PublicLayoutComponent } from '@core/layouts/public-layout/public-layout.component';

export const SITE_ROUTES: Routes = [
  {
    path: '',
    component: PublicLayoutComponent,
    children: [
      {
        path: '',
        title: 'Inicio',
        loadComponent: () =>
          import('./presentation/pages/landing-page/landing-page.component').then(
            (module) => module.LandingPageComponent,
          ),
      },
      {
        path: 'repositorios',
        title: 'Repositorios públicos',
        loadComponent: () =>
          import(
            './presentation/pages/public-repositories-page/public-repositories-page.component'
          ).then((module) => module.PublicRepositoriesPageComponent),
      },
      {
        path: 'profile',
        loadChildren: () =>
          import('@features/profile/presentation/profile.routes').then(
            (module) => module.PROFILE_ROUTES,
          ),
      },
    ],
  },
];
