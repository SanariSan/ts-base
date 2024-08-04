import type { LevelWithSilentOrString, LogFn, Logger as PinoLogger } from 'pino';
import { pino } from 'pino';
import { DI } from '../di';

class Logger {
  private readonly pino: PinoLogger;

  constructor() {
    this.pino = pino({
      level: 'debug',
      formatters: {
        level: (label) => ({ level: label.toUpperCase() }),
        bindings: () => ({}),
      },
      timestamp: pino.stdTimeFunctions.isoTime,
    });
  }

  cli(level: LevelWithSilentOrString, obj: object | unknown, message?: string, ...rest: unknown[]) {
    (this.pino[level] as LogFn)(obj, message, ...rest);
  }
}
DI.register(Logger, []);

export { Logger };
