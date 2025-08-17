import { UserUtilitiesService } from './user-utilities.service';
import { UsersCrudService } from './users-crud.service';

export class UsersService {
  constructor(
    public readonly usersCrudService: UsersCrudService,
    public readonly userUtilitiesService: UserUtilitiesService,
  ) {}
}
