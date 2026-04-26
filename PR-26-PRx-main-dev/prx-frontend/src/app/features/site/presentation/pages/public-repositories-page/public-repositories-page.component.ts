import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

import {
  AppPaginationChange,
  AppPaginationComponent,
} from '@shared/ui/components/app-pagination/app-pagination.component';
import { RepositoryCardComponent } from '@shared/ui/components/repository-card/repository-card.component';
import { PAGINATION_CONSTANTS } from '@shared/constants/pagination.constants';
import { PaginatedResponseModel } from '@shared/models/paginated-response.model';

export interface PublicRepositoryItem {
  id: number;
  title: string;
  author: string;
  excerpt: string;
  stars: number;
}

const AUTHORS = [
  'María M.',
  'José H.',
  'Ana L.',
  'Carlos R.',
  'Lucía V.',
  'Diego P.',
  'Sofía T.',
  'Miguel A.',
];

const TITLE_PREFIXES = [
  'Arte de la realidad',
  'Territorios en red',
  'Memorias compartidas',
  'Ciencia abierta',
  'Educación viva',
  'Saberes locales',
  'Archivos del barrio',
  'Voces del agua',
];

function buildMockRepositories(total: number): PublicRepositoryItem[] {
  return Array.from({ length: total }, (_, index) => {
    const id = index + 1;
    const title = `${TITLE_PREFIXES[index % TITLE_PREFIXES.length]} — vol. ${Math.floor(id / TITLE_PREFIXES.length) + 1}`;
    return {
      id,
      title,
      author: AUTHORS[id % AUTHORS.length],
      excerpt:
        'Proyecto colaborativo con materiales, notas y recursos compartidos por la comunidad. Explora, reutiliza y contribuye con nuevas capas de sentido.',
      stars: 6 + (id % 6),
    };
  });
}

@Component({
  selector: 'app-public-repositories-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    RepositoryCardComponent,
    AppPaginationComponent,
  ],
  templateUrl: './public-repositories-page.component.html',
  styleUrl: './public-repositories-page.component.scss',
})
export class PublicRepositoriesPageComponent {
  private readonly allItems = buildMockRepositories(180);

  protected draftQuery = '';

  protected readonly searchQuery = signal('');

  protected readonly filteredItems = computed(() => {
    const q = this.searchQuery().trim().toLowerCase();
    if (!q) {
      return this.allItems;
    }

    return this.allItems.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.author.toLowerCase().includes(q) ||
        item.excerpt.toLowerCase().includes(q),
    );
  });

  protected readonly paginated = signal<PaginatedResponseModel<PublicRepositoryItem>>({
    items: [],
    total: 0,
    page: PAGINATION_CONSTANTS.DEFAULT_PAGE,
    limit: 5,
  });

  protected readonly first = computed(
    () =>
      (this.paginated().page - PAGINATION_CONSTANTS.DEFAULT_PAGE) * this.paginated().limit,
  );

  protected readonly rows = computed(() => this.paginated().limit);
  protected readonly totalRecords = computed(() => this.paginated().total);

  protected readonly rowsPerPageOptions = [5, 10, 20, 50];

  constructor() {
    this.loadPage(PAGINATION_CONSTANTS.DEFAULT_PAGE, 5);
  }

  protected onSearch(): void {
    this.searchQuery.set(this.draftQuery.trim());
    this.loadPage(PAGINATION_CONSTANTS.DEFAULT_PAGE, this.paginated().limit);
  }

  protected handlePageChange(event: AppPaginationChange): void {
    const page =
      Math.floor(event.first / event.rows) + PAGINATION_CONSTANTS.DEFAULT_PAGE;
    this.loadPage(page, event.rows);
  }

  private loadPage(page: number, limit: number): void {
    const items = this.filteredItems();
    const safePage = Math.max(page, PAGINATION_CONSTANTS.DEFAULT_PAGE);
    const safeLimit = Math.min(Math.max(limit, 1), PAGINATION_CONSTANTS.MAX_LIMIT);
    const start = (safePage - PAGINATION_CONSTANTS.DEFAULT_PAGE) * safeLimit;
    const end = start + safeLimit;

    this.paginated.set({
      items: items.slice(start, end),
      total: items.length,
      page: safePage,
      limit: safeLimit,
    });
  }
}
