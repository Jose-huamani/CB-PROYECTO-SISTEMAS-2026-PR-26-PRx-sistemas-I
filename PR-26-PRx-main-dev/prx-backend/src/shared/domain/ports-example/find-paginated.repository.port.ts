// Ejemplo, copiar su estructura para sus repositories en caso usarlo
// Advertencia, se eliminara este archivo al final del Proyecto
import { PaginatedResponseDto } from '@shared/application/dto/paginated-response.dto';

export abstract class FindPaginatedRepositoryPort<TEntity> {
  abstract findPaginated(
    page: number,
    limit: number,
  ): Promise<PaginatedResponseDto<TEntity>>;
}
