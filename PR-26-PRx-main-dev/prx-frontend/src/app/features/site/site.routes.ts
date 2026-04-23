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
    ],
  },
];
