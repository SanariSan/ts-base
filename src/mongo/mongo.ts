import type { Mongoose } from 'mongoose';
import mongoose from 'mongoose';
import { DI } from '../di';
import { Logger } from '../logger';

export class Mongo {
  private client: Mongoose | undefined;

  constructor(private readonly logger: Logger) {
    mongoose.connection.on('connected', () => {
      this.logger.cli('warn', 'Mongoose connection established');
    });

    mongoose.connection.on('error', (err: Error) => {
      this.logger.cli('error', err, 'Mongoose connection error');
    });

    mongoose.connection.on('disconnected', () => {
      this.logger.cli('warn', 'Mongoose connection disconnected');
    });
  }

  private async connect() {
    this.logger.cli('info', 'Connecting to MongoDB');
    return mongoose.connect(process.env.MONGO_URL ?? '');
  }

  public async getInstance() {
    if (this.client === undefined) {
      this.client = await this.connect();
    }

    return this.client;
  }
}

DI.register(Mongo, [() => Logger]);
