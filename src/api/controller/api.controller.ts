import { Router } from 'express';
import { DI } from '../../di';
import { ProxyController } from '../../core/proxy';

export class ApiController {
  public readonly basePath: string = '/api';
  public readonly router: Router = Router();

  constructor(private readonly proxyController: ProxyController) {
    this.router.use(proxyController.basePath, proxyController.router);
  }
}

DI.register(ApiController, [() => ProxyController]);
