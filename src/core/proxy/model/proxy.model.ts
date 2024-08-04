import type { Model, Document } from 'mongoose';
import mongoose, { Schema } from 'mongoose';
import { DI } from '../../../di';
import { Mongo } from '../../../mongo';

export interface IProxy {
  urlSchema: string;
  ip: string;
  port: string;
  login?: string;
  password?: string;
  isAvailable: boolean;
}

export interface IProxyDocument extends Document, IProxy {}

export class ProxyModel {
  static modelName = 'Proxy';

  schema: Schema = new Schema({
    urlSchema: String,
    ip: String,
    port: String,
    login: String,
    password: String,
    isAvailable: Boolean,
  });

  model: Model<IProxyDocument> = mongoose.model<IProxyDocument>(ProxyModel.modelName, this.schema);
}

DI.register(ProxyModel, [() => Mongo]);
