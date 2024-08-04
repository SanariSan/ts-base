import type { Request, Response } from 'express';
import { DI } from '../../di';
import { Logger } from '../../logger';
import type { IGenericError } from '../errors';

export class ApiResponse {
  constructor(private readonly logger: Logger) {}

  public success(req: Request, res: Response, data: object) {
    this.logger.cli('info', data);
    return res.json({ status: 'success', data });
  }

  public error(req: Request, res: Response, error: IGenericError) {
    this.logger.cli('error', error);

    const message = error.message !== '' ? error.message : 'Internal error';
    const { miscellaneous } = error;
    return res.json({ status: 'error', error: { message, miscellaneous } });
  }
}

DI.register(ApiResponse, [() => Logger]);
