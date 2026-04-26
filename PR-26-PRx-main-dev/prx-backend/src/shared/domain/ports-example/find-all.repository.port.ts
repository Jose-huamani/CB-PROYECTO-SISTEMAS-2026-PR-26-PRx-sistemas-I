// Ejemplo, copiar su estructura para sus repositories en caso usarlo
// Advertencia, se eliminara este archivo al final del Proyecto
export abstract class FindAllRepositoryPort<TEntity> {
  abstract findAll(): Promise<TEntity[]>;
}
