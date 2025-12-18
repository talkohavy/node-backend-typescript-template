import type { CreateDragonDto, UpdateDragonDto } from '../../../dragons/services/interfaces/dragons.service.interface';
import type { Dragon } from '../../../dragons/types';

export interface IDragonsAdapter {
  getDragons(): Promise<Array<Dragon>>;
  getDragonById(dragonId: string): Promise<Dragon | null>;
  createDragon(data: CreateDragonDto): Promise<Dragon>;
  updateDragon(dragonId: string, data: UpdateDragonDto): Promise<Dragon | null>;
  deleteDragon(dragonId: string): Promise<{ message: string } | null>;
}
