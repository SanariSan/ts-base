import { validate } from 'class-validator';
import type { NextFunction, Request, Response } from 'express';
import { ValidationError } from '../errors';
import type { EVALIDATION_TARGET, TClass } from './validator.type';

export const validateDTO =
  (dtoClass: TClass, target: EVALIDATION_TARGET) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const DtoClass = dtoClass;
    const dtoInstance = new DtoClass();

    Object.assign(dtoInstance, req[target]);

    const errors = await validate(dtoInstance);
    if (errors.length > 0) {
      next(new ValidationError({ message: 'Validation error', miscellaneous: { errors } }));
    }

    req[target] = dtoInstance;
    next();
  };
