import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import {
  Component,
  OnInit,
  inject,
  signal,
  computed,
  ElementRef,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';

import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { ChipModule } from 'primeng/chip';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { TooltipModule } from 'primeng/tooltip';

import { NotificationService } from '@core/services/notification.service';
import { AuthFacade } from '@features/auth/application/facades/auth.facade';
import { ProfileFacade } from '@features/profile/application/facades/profile.facade';
import { PROFILE_MESSAGES } from '@features/profile/constants/profile-messages.constants';
import { ProfileModel } from '@features/profile/domain/models/profile.model';
import {
  getApiErrorNotificationMessage,
  getApiNotificationMessage,
} from '@shared/utils/api-notification.util';

const SOCIAL_NETWORK_IDS = {
  LINKEDIN: 1,
  GITHUB: 2,
  FACEBOOK: 3,
  TWITTER: 4,
  INSTAGRAM: 5,
  YOUTUBE: 6,
} as const;

function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const newPassword = control.get('newPassword')?.value;
  const confirmPassword = control.get('confirmPassword')?.value;
  if (newPassword && confirmPassword && newPassword !== confirmPassword) {
    return { passwordMismatch: true };
  }
  return null;
}

@Component({
  selector: 'app-edit-profile-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    AvatarModule,
    ButtonModule,
    ChipModule,
    InputTextModule,
    PasswordModule,
    SelectModule,
    TextareaModule,
    TooltipModule,
  ],
  templateUrl: './edit-profile-page.component.html',
  styleUrl: './edit-profile-page.component.scss',
})
export class EditProfilePageComponent implements OnInit {
  @ViewChild('avatarInput') avatarInput!: ElementRef<HTMLInputElement>;
  @ViewChild('tagInput') tagInput!: ElementRef<HTMLInputElement>;

  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly profileFacade = inject(ProfileFacade);
  private readonly authFacade = inject(AuthFacade);
  private readonly notificationService = inject(NotificationService);

  protected readonly currentUser = this.authFacade.currentUser;
  protected readonly loading = signal(false);
  protected readonly saving = signal(false);
  protected readonly savingPassword = signal(false);
  protected readonly uploadingAvatar = signal(false);
  protected readonly newTagValue = signal('');

  protected readonly tags = signal<string[]>([]);

  protected readonly avatarPreview = computed(() => {
    return this.currentUser()?.avatarUrl ?? '';
  });

  protected readonly profileForm: FormGroup = this.fb.group({
    firstName: ['', [Validators.maxLength(60)]],
    lastName: ['', [Validators.maxLength(60)]],
    secondLastName: ['', [Validators.maxLength(60)]],
    biography: ['', [Validators.maxLength(2000)]],
    phoneCodeId: [null as number | null],
    phoneNumber: ['', [Validators.maxLength(20)]],
    countryId: [null as number | null],
    regionName: ['', [Validators.maxLength(50)]],
    townName: ['', [Validators.maxLength(50)]],
    linkedin: ['', [Validators.maxLength(255)]],
    github: ['', [Validators.maxLength(255)]],
    facebook: ['', [Validators.maxLength(255)]],
    twitter: ['', [Validators.maxLength(255)]],
    instagram: ['', [Validators.maxLength(255)]],
    youtube: ['', [Validators.maxLength(255)]],
  });

  protected readonly passwordForm: FormGroup = this.fb.group(
    {
      currentPassword: ['', [Validators.required, Validators.minLength(8)]],
      newPassword: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(72)]],
      confirmPassword: ['', [Validators.required]],
    },
    { validators: passwordMatchValidator },
  );

  protected readonly phoneCodes = signal<{ label: string; value: number }[]>([
    { label: '+52 (México)', value: 1 },
    { label: '+1 (EE.UU.)', value: 2 },
    { label: '+34 (España)', value: 3 },
    { label: '+57 (Colombia)', value: 4 },
    { label: '+54 (Argentina)', value: 5 },
  ]);

  protected readonly countries = signal<{ label: string; value: number }[]>([
    { label: 'México', value: 1 },
    { label: 'Estados Unidos', value: 2 },
    { label: 'España', value: 3 },
    { label: 'Colombia', value: 4 },
    { label: 'Argentina', value: 5 },
  ]);

  ngOnInit(): void {
    this.loadProfile();
  }

  protected triggerAvatarUpload(): void {
    this.avatarInput.nativeElement.click();
  }

  protected onAvatarSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    this.uploadingAvatar.set(true);
    this.profileFacade
      .uploadAvatar(file)
      .pipe(finalize(() => this.uploadingAvatar.set(false)))
      .subscribe({
        next: (response) => {
          const avatarUrl = response.data?.avatarUrl;
          if (avatarUrl && this.currentUser()) {
            this.authFacade.updateAuthenticatedUser({
              ...this.currentUser()!,
              avatarUrl,
            });
          }
          this.notificationService.success('Perfil', PROFILE_MESSAGES.AVATAR.SUCCESS);
        },
        error: () => {
          this.notificationService.error('Perfil', PROFILE_MESSAGES.AVATAR.ERROR);
        },
      });
  }

  protected addTag(): void {
    const value = this.newTagValue().trim();
    if (!value || this.tags().includes(value)) return;
    this.tags.update((tags) => [...tags, value]);
    this.newTagValue.set('');
    if (this.tagInput) {
      this.tagInput.nativeElement.value = '';
    }
  }

  protected onTagInputKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.addTag();
    }
  }

  protected onTagInputChange(value: string): void {
    this.newTagValue.set(value);
  }

  protected removeTag(tag: string): void {
    this.tags.update((tags) => tags.filter((t) => t !== tag));
  }

  protected saveProfile(): void {
    if (this.saving()) return;

    this.profileForm.markAllAsTouched();

    if (this.profileForm.invalid) {
      this.notificationService.warn('Formulario', 'Revisa los campos del formulario.');
      return;
    }

    const formValue = this.profileForm.getRawValue();

    const socialNetworks = [
      { socialNetworkId: SOCIAL_NETWORK_IDS.LINKEDIN, username: formValue.linkedin ?? '' },
      { socialNetworkId: SOCIAL_NETWORK_IDS.GITHUB, username: formValue.github ?? '' },
      { socialNetworkId: SOCIAL_NETWORK_IDS.FACEBOOK, username: formValue.facebook ?? '' },
      { socialNetworkId: SOCIAL_NETWORK_IDS.TWITTER, username: formValue.twitter ?? '' },
      { socialNetworkId: SOCIAL_NETWORK_IDS.INSTAGRAM, username: formValue.instagram ?? '' },
      { socialNetworkId: SOCIAL_NETWORK_IDS.YOUTUBE, username: formValue.youtube ?? '' },
    ].filter((sn) => sn.username.length > 0);

    this.saving.set(true);

    this.profileFacade
      .updateProfile({
        firstName: formValue.firstName || null,
        lastName: formValue.lastName || null,
        secondLastName: formValue.secondLastName || null,
        biography: formValue.biography || null,
        phoneCodeId: formValue.phoneCodeId || null,
        phoneNumber: formValue.phoneNumber || null,
        countryId: formValue.countryId || null,
        regionName: formValue.regionName || null,
        townName: formValue.townName || null,
        socialNetworks,
        tags: this.tags(),
      })
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe({
        next: (response) => {
          this.notificationService.success(
            'Perfil',
            getApiNotificationMessage(response, PROFILE_MESSAGES.UPDATE.SUCCESS),
          );
        },
        error: (error: HttpErrorResponse) => {
          this.notificationService.error(
            'Perfil',
            getApiErrorNotificationMessage(error, PROFILE_MESSAGES.UPDATE.ERROR),
          );
        },
      });
  }

  protected savePassword(): void {
    if (this.savingPassword()) return;

    this.passwordForm.markAllAsTouched();

    if (this.passwordForm.invalid) {
      if (this.passwordForm.hasError('passwordMismatch')) {
        this.notificationService.warn('Contraseña', 'Las contraseñas nuevas no coinciden.');
      } else {
        this.notificationService.warn('Formulario', 'Revisa los campos de contraseña.');
      }
      return;
    }

    const { currentPassword, newPassword } = this.passwordForm.getRawValue() as {
      currentPassword: string;
      newPassword: string;
    };

    this.savingPassword.set(true);

    this.profileFacade
      .changePassword({ currentPassword, newPassword })
      .pipe(finalize(() => this.savingPassword.set(false)))
      .subscribe({
        next: (response) => {
          this.notificationService.success(
            'Contraseña',
            getApiNotificationMessage(response, PROFILE_MESSAGES.CHANGE_PASSWORD.SUCCESS),
          );
          this.passwordForm.reset();
        },
        error: (error: HttpErrorResponse) => {
          this.notificationService.error(
            'Contraseña',
            getApiErrorNotificationMessage(error, PROFILE_MESSAGES.CHANGE_PASSWORD.ERROR),
          );
        },
      });
  }

  protected cancel(): void {
    void this.router.navigate(['/']);
  }

  private loadProfile(): void {
    this.loading.set(true);

    this.profileFacade
      .getMyProfile()
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (response) => {
          const profile = response.data;
          if (profile) {
            this.populateForm(profile);
          }
        },
        error: () => {
          this.notificationService.error('Perfil', PROFILE_MESSAGES.LOAD.ERROR);
        },
      });
  }

  private populateForm(profile: ProfileModel): void {
    const getSocialUsername = (id: number): string => {
      return profile.socialNetworks.find((sn) => sn.socialNetworkId === id)?.username ?? '';
    };

    this.profileForm.patchValue({
      firstName: profile.firstName ?? '',
      lastName: profile.lastName ?? '',
      secondLastName: profile.secondLastName ?? '',
      biography: profile.biography ?? '',
      phoneCodeId: profile.phoneCodeId,
      phoneNumber: profile.phoneNumber ?? '',
      countryId: profile.countryId,
      regionName: profile.regionName ?? '',
      townName: profile.townName ?? '',
      linkedin: getSocialUsername(SOCIAL_NETWORK_IDS.LINKEDIN),
      github: getSocialUsername(SOCIAL_NETWORK_IDS.GITHUB),
      facebook: getSocialUsername(SOCIAL_NETWORK_IDS.FACEBOOK),
      twitter: getSocialUsername(SOCIAL_NETWORK_IDS.TWITTER),
      instagram: getSocialUsername(SOCIAL_NETWORK_IDS.INSTAGRAM),
      youtube: getSocialUsername(SOCIAL_NETWORK_IDS.YOUTUBE),
    });

    this.tags.set(profile.tags.map((t) => t.tagName));
  }
}
