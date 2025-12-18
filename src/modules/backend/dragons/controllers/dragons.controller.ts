import type { Application, Request, Response } from 'express';
import type { ControllerFactory } from '../../../../lib/lucky-server';
import type { IDragonsAdapter } from '../adapters/dragons.adapter.interface';
import { API_URLS, StatusCodes } from '../../../../common/constants';
import { joiBodyMiddleware } from '../../../../middlewares/joi-body.middleware';
import { createDragonSchema } from './dto/createDragonSchema.dto';
import { updateDragonSchema } from './dto/updateDragonSchema.dto';

export class DragonsController implements ControllerFactory {
  constructor(
    private readonly app: Application,
    private readonly dragonsAdapter: IDragonsAdapter,
  ) {}

  private createDragon() {
    this.app.post(API_URLS.dragons, joiBodyMiddleware(createDragonSchema), async (req: Request, res: Response) => {
      this.app.logger.info(`POST ${API_URLS.dragons} - creating new dragon`);

      const { body } = req;

      const newDragon = await this.dragonsAdapter.createDragon(body);

      res.status(StatusCodes.CREATED).json(newDragon);
    });
  }

  private getDragons() {
    this.app.get(API_URLS.dragons, async (_req, res) => {
      this.app.logger.info(`GET ${API_URLS.dragons} - fetching dragons`);

      const dragons = await this.dragonsAdapter.getDragons();

      res.json(dragons);
    });
  }

  private getDragonById() {
    this.app.get(API_URLS.dragonById, async (req: Request, res: Response) => {
      this.app.logger.info(`GET ${API_URLS.dragonById} - fetching dragon by ID`);

      const dragonId = req.params.dragonId!;

      const dragon = await this.dragonsAdapter.getDragonById(dragonId);

      if (!dragon) {
        this.app.logger.error('Dragon not found', dragonId);

        return void res.status(StatusCodes.NOT_FOUND).json({ message: 'Dragon not found' });
      }

      res.json(dragon);
    });
  }

  private updateDragon() {
    this.app.patch(API_URLS.dragonById, joiBodyMiddleware(updateDragonSchema), async (req: Request, res: Response) => {
      this.app.logger.info(`PUT ${API_URLS.dragonById} - updating dragon by ID`);

      const dragonId = req.params.dragonId!;
      const dragon = req.body;
      const updatedDragon = await this.dragonsAdapter.updateDragon(dragonId, dragon);

      if (!updatedDragon) {
        this.app.logger.error('Dragon not found', dragonId);

        return void res.status(StatusCodes.NOT_FOUND).json({ message: 'Dragon not found' });
      }

      res.json(updatedDragon);
    });
  }

  private deleteDragon() {
    this.app.delete(API_URLS.dragonById, async (req: Request, res: Response) => {
      this.app.logger.info(`DELETE ${API_URLS.dragonById} - deleting dragon by ID`);

      const dragonId = req.params.dragonId!;
      const deletedDragon = await this.dragonsAdapter.deleteDragon(dragonId);

      if (!deletedDragon) {
        this.app.logger.error('Dragon not found', dragonId);

        return void res.status(StatusCodes.NOT_FOUND).json({ message: 'Dragon not found' });
      }

      res.json({ message: 'Dragon deleted successfully' });
    });
  }

  registerRoutes() {
    this.createDragon();
    this.getDragons();
    this.getDragonById();
    this.updateDragon();
    this.deleteDragon();
  }
}
