import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-repository-card',
  standalone: true,
  imports: [RouterLink, ButtonModule],
  templateUrl: './repository-card.component.html',
  styleUrl: './repository-card.component.scss',
})
export class RepositoryCardComponent {
  readonly title = input.required<string>();
  readonly author = input.required<string>();
  readonly excerpt = input.required<string>();
  readonly stars = input<number>(10);
  readonly link = input<string>('/repositorios');
}
