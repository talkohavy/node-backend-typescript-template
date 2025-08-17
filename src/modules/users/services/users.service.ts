import { UserUtilitiesService } from './user-utilities.service';
import { UsersCrudService } from './users-crud.service';

export class UsersService {
  constructor(
    public readonly crudService: UsersCrudService,
    public readonly utilitiesService: UserUtilitiesService,
  ) {}
}
