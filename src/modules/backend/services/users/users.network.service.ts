import { UserUtilitiesNetworkService } from './user-utilities.network.service';
import { UsersCrudNetworkService } from './users-crud.network.service';

export class UsersNetworkService {
  constructor(
    public readonly crudService: UsersCrudNetworkService,
    public readonly utilityService: UserUtilitiesNetworkService,
  ) {}
}
