import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';

import {
  AppPaginationChange,
  AppPaginationComponent,
} from '@shared/ui/components/app-pagination/app-pagination.component';
import { PAGINATION_CONSTANTS } from '@shared/constants/pagination.constants';
import { PaginatedResponseModel } from '@shared/models/paginated-response.model';

interface FruitModel {
  id: number;
  name: string;
  description: string;
}

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [CommonModule, AppPaginationComponent],
  templateUrl: './landing-page.component.html',
})
export class LandingPageComponent {
  private readonly allFruits: FruitModel[] = [
    { id: 1, name: 'Mango', description: 'Fruta tropical dulce.' },
    { id: 2, name: 'Piña', description: 'Fruta tropical jugosa.' },
    { id: 3, name: 'Manzana', description: 'Fruta clásica y versátil.' },
    { id: 4, name: 'Banana', description: 'Fruta suave y energética.' },
    { id: 5, name: 'Papaya', description: 'Fruta tropical de pulpa naranja.' },
    { id: 6, name: 'Sandía', description: 'Fruta refrescante y ligera.' },
    { id: 7, name: 'Melón', description: 'Fruta dulce y aromática.' },
    { id: 8, name: 'Uva', description: 'Fruta pequeña y fácil de comer.' },
    { id: 9, name: 'Durazno', description: 'Fruta suave y fragante.' },
    { id: 10, name: 'Pera', description: 'Fruta dulce de textura suave.' },
    { id: 11, name: 'Kiwi', description: 'Fruta ácida con semillas pequeñas.' },
    { id: 12, name: 'Fresa', description: 'Fruta roja y aromática.' },
    { id: 13, name: 'Naranja', description: 'Fruta cítrica rica en jugo.' },
    { id: 14, name: 'Mandarina', description: 'Fruta cítrica fácil de pelar.' },
    { id: 15, name: 'Granada', description: 'Fruta con semillas jugosas.' },
    { id: 16, name: 'Cereza', description: 'Fruta pequeña y dulce.' },
    { id: 17, name: 'Frambuesa', description: 'Fruta roja y delicada.' },
    { id: 18, name: 'Mora', description: 'Fruta oscura y jugosa.' },
    { id: 19, name: 'Guayaba', description: 'Fruta tropical aromática.' },
    { id: 20, name: 'Maracuyá', description: 'Fruta tropical ácida.' },
    { id: 21, name: 'Lima', description: 'Fruta cítrica refrescante.' },
    { id: 22, name: 'Limón', description: 'Fruta cítrica ácida.' },
    { id: 23, name: 'Coco', description: 'Fruta tropical con pulpa blanca.' },
    { id: 24, name: 'Aguacate', description: 'Fruta cremosa y nutritiva.' },
    { id: 25, name: 'Higo', description: 'Fruta dulce con semillas.' },
    { id: 26, name: 'Tamarindo', description: 'Fruta tropical agridulce.' },
    { id: 27, name: 'Carambola', description: 'Fruta en forma de estrella.' },
    { id: 28, name: 'Chirimoya', description: 'Fruta tropical cremosa.' },
    { id: 29, name: 'Pitahaya', description: 'Fruta exótica de pulpa blanca.' },
    { id: 30, name: 'Litchi', description: 'Fruta pequeña y dulce.' },
  ];

  protected readonly paginatedFruits = signal<PaginatedResponseModel<FruitModel>>({
    items: [],
    total: 0,
    page: PAGINATION_CONSTANTS.DEFAULT_PAGE,
    limit: PAGINATION_CONSTANTS.DEFAULT_LIMIT,
  });

  protected readonly first = computed(
    () =>
      (this.paginatedFruits().page - PAGINATION_CONSTANTS.DEFAULT_PAGE) *
      this.paginatedFruits().limit,
  );

  protected readonly rows = computed(() => this.paginatedFruits().limit);
  protected readonly totalRecords = computed(() => this.paginatedFruits().total);

  constructor() {
    this.loadFruits(PAGINATION_CONSTANTS.DEFAULT_PAGE, PAGINATION_CONSTANTS.DEFAULT_LIMIT);
  }

  protected handlePageChange(event: AppPaginationChange): void {
    const page = Math.floor(event.first / event.rows) + PAGINATION_CONSTANTS.DEFAULT_PAGE;
    const limit = event.rows;

    this.loadFruits(page, limit);
  }

  private loadFruits(page: number, limit: number): void {
    const safePage = Math.max(page, PAGINATION_CONSTANTS.DEFAULT_PAGE);
    const safeLimit = Math.min(Math.max(limit, 1), PAGINATION_CONSTANTS.MAX_LIMIT);

    const start = (safePage - PAGINATION_CONSTANTS.DEFAULT_PAGE) * safeLimit;
    const end = start + safeLimit;

    const response: PaginatedResponseModel<FruitModel> = {
      items: this.allFruits.slice(start, end),
      total: this.allFruits.length,
      page: safePage,
      limit: safeLimit,
    };

    this.paginatedFruits.set(response);
  }
}
