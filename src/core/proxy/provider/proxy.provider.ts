import { DI } from '../../../di';
import { Logger } from '../../../logger';
import type { CreateProxyFromOptionsDTO } from '../dto';
import { ProxyRepository } from '../repository';

export class ProxyProvider {
  constructor(private readonly logger: Logger, private readonly proxyRepository: ProxyRepository) {}

  public constructFromOptions({ schema, ip, port, login, password }: CreateProxyFromOptionsDTO) {
    let url = '';

    url += `${schema}://`;

    if (login !== undefined && password !== undefined) {
      url += `${login}:${password}@`;
    }

    url += `${ip}:${port}`;

    return url;
  }

  public destructFromUrl({ url }: { url: string }) {
    // http://log:pass@ip:port
    // todo: parse with some library (?)

    const { schema, ip, port, login, password } = {
      schema: '',
      ip: '',
      port: '',
      login: '',
      password: '',
    };

    return { schema, ip, port, login, password };
  }

  public async createFromOptions({ schema, ip, port, login, password }: CreateProxyFromOptionsDTO) {
    return this.proxyRepository.create({ urlSchema: schema, ip, port, login, password });
  }

  // not funtional
  public async createFromUrl({ url }: { url: string }) {
    const { schema, ip, port, login, password } = this.destructFromUrl({ url });

    return this.proxyRepository.create({ urlSchema: schema, ip, port, login, password });
  }

  public async getById({ id }: { id: string }) {
    return this.proxyRepository.getById({ id });
  }

  public async getFree() {
    return this.proxyRepository.getFree();
  }
}

DI.register(ProxyProvider, [() => Logger, () => ProxyRepository]);
