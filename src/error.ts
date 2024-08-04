import type { Express, NextFunction, Request, Response } from 'express';
import { DI } from './di';
import type { IGenericError } from './api/errors';
import { InternalError, NotFoundError, ValidationError } from './api/errors';
import { ApiResponse } from './api/response';

export function setupHandleErrors(app: Express) {
  app.use((err: IGenericError, req: Request, res: Response, next: NextFunction) => {
    // for rare cases when something broke while streaming data to client
    // fallback to default express handler
    if (res.headersSent) {
      next(err);
      return;
    }

    const apiResponse = DI.resolve(ApiResponse);

    switch (true) {
      case err instanceof NotFoundError: {
        res.status(404);
        break;
      }
      case err instanceof ValidationError: {
        res.status(504);
        break;
      }
      case err instanceof InternalError: {
        res.status(500);
        break;
      }
      default: {
        res.status(500);
      }
    }

    apiResponse.error(req, res, err);
  });
}
