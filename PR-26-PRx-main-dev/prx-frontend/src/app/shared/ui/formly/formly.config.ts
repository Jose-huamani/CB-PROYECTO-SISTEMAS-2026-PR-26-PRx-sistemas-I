import { ConfigOption } from '@ngx-formly/core';

import { AppInputFieldComponent } from './types/app-input-field/app-input-field.component';
import { AppPasswordFieldComponent } from './types/app-password-field/app-password-field.component';
import { AppOtpFieldComponent } from '@shared/ui/formly/types/app-otp-field/app-otp-field.component';
import { AppTextareaFieldComponent } from '@shared/ui/formly/types/app-textarea-field/app-textarea-field.component';
import { AppSelectFieldComponent } from '@shared/ui/formly/types/app-select-field/app-select-field.component';

export const APP_FORMLY_CONFIG: ConfigOption = {
  types: [
    {
      name: 'app-input',
      component: AppInputFieldComponent,
    },
    {
      name: 'app-password',
      component: AppPasswordFieldComponent,
    },
    {
      name: 'app-otp',
      component: AppOtpFieldComponent,
    },
    {
      name: 'app-textarea',
      component: AppTextareaFieldComponent,
    },
    {
      name: 'app-select',
      component: AppSelectFieldComponent,
    },
  ],
};
