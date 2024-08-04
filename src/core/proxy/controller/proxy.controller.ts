import type { Request, Response } from 'express';
import { Router } from 'express';
import { asyncHandleMW } from '../../../api/handle';
import { ApiResponse } from '../../../api/response';
import { EVALIDATION_TARGET, validateDTO } from '../../../api/validator';
import { DI } from '../../../di';
import { Logger } from '../../../logger';
import type { CreateProxyFromUrlDTO } from '../dto';
import { CreateProxyFromOptionsDTO } from '../dto/create-from-options.dto';
import { ProxyProvider } from '../provider';

export class ProxyController {
  public readonly basePath: string = '/proxy';
  public readonly router: Router = Router();

  constructor(
    private readonly logger: Logger,
    private readonly apiResponse: ApiResponse,
    private readonly proxyProvider: ProxyProvider,
  ) {
    this.router.post(
      '/createFromOptions',
      asyncHandleMW(validateDTO(CreateProxyFromOptionsDTO, EVALIDATION_TARGET.BODY)),
      asyncHandleMW(this.createFromOptions.bind(this)),
    );

    // this.router.post(
    //   '/createFromUrl',
    //   asyncHandleMW(validateDTO(CreateProxyFromUrlDTO, EVALIDATION_TARGET.BODY)),
    //   asyncHandleMW(this.createFromUrl.bind(this)),
    // );
  }

  async createFromOptions(req: Request, res: Response) {
    this.logger.cli('info', 'Saving proxy passed as options');

    return this.apiResponse.success(
      req,
      res,
      await this.proxyProvider.createFromOptions(req.body as CreateProxyFromOptionsDTO),
    );
  }

  async createFromUrl(req: Request, res: Response) {
    this.logger.cli('info', 'Parsing and saving proxy passed as url');

    return this.apiResponse.success(
      req,
      res,
      await this.proxyProvider.createFromUrl(req.body as CreateProxyFromUrlDTO),
    );
  }
}

DI.register(ProxyController, [() => Logger, () => ApiResponse, () => ProxyProvider]);
