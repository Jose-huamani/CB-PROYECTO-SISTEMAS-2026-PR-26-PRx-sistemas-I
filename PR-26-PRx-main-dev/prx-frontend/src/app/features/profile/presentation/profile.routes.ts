import { Routes } from '@angular/router';

import { authGuard } from '@core/guards/auth.guard';

export const PROFILE_ROUTES: Routes = [
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/edit-profile-page/edit-profile-page.component').then(
        (module) => module.EditProfilePageComponent,
      ),
    title: 'Editar Perfil',
  },
];
