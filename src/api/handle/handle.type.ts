import type { NextFunction, Response } from 'express';

// too complicated to make strong type checking here, maybe some day...
// upd: 2 years passed, not doing it, fk express :)
type TAsyncMWFN = (req: any, res: Response, next: NextFunction) => Promise<unknown>;
type TSyncMWFN = (req: any, res: Response, next: NextFunction) => unknown;

export type { TAsyncMWFN, TSyncMWFN };
