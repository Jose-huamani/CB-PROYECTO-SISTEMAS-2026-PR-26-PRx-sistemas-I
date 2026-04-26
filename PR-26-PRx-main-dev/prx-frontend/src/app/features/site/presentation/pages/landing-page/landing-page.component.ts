import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ButtonModule } from 'primeng/button';

import { RepositoryCardComponent } from '@shared/ui/components/repository-card/repository-card.component';

interface LandingRepo {
  id: number;
  title: string;
  author: string;
  excerpt: string;
  stars: number;
}

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [RouterLink, ButtonModule, RepositoryCardComponent],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss',
})
export class LandingPageComponent {
  protected readonly previewRepos: LandingRepo[] = [
    {
      id: 1,
      title: 'Arte de la realidad',
      author: 'María M.',
      excerpt:
        'Exploración colectiva sobre cómo el arte transforma la percepción del mundo y las comunidades que lo habitan.',
      stars: 10,
    },
    {
      id: 2,
      title: 'Memorias del territorio',
      author: 'Carlos R.',
      excerpt:
        'Repositorio de relatos orales, mapas y archivos que documentan la historia viva de distintas regiones.',
      stars: 10,
    },
    {
      id: 3,
      title: 'Ciencia abierta en comunidad',
      author: 'Ana L.',
      excerpt:
        'Proyectos de investigación colaborativa con datos y metodologías compartidas para replicar y ampliar resultados.',
      stars: 10,
    },
    {
      id: 4,
      title: 'Educación y cocreación',
      author: 'Luis P.',
      excerpt:
        'Materiales, guías y experiencias para aprender y enseñar en red, con enfoque participativo.',
      stars: 10,
    },
  ];
}
