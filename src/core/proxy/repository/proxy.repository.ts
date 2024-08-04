import type { Types } from 'mongoose';
import { DI } from '../../../di';
import type { IProxy } from '../model';
import { ProxyModel } from '../model';

export class ProxyRepository {
  constructor(private readonly proxyModel: ProxyModel) {}

  public async create({ urlSchema, ip, port, login, password }: Omit<IProxy, 'isAvailable'>) {
    return this.proxyModel.model.create({
      urlSchema,
      ip,
      port,
      login,
      password,
      isAvailable: true,
    });
  }

  public async getById({ id }: { id: Types.ObjectId | string }) {
    return this.proxyModel.model.findById(id);
  }

  public async getFree() {
    return this.proxyModel.model.findOneAndUpdate(
      {
        isAvailable: true,
      },
      {
        isAvailable: false,
      },
      {
        new: true,
      },
    );
  }
}

DI.register(ProxyRepository, [() => ProxyModel]);
