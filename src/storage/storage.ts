import { DEFAULT_STORAGE_EXPIRATION_CHECK, DEFAULT_STORAGE_KEY_EXPIRE_MS } from './storage.const';
import type { TStorage, TStoredData } from './storage.type';

export class CustomStorage {
  private readonly defaultExpireMs: number;
  private storage: TStorage;

  constructor(defaultExpireMs?: number) {
    this.defaultExpireMs = defaultExpireMs ?? DEFAULT_STORAGE_KEY_EXPIRE_MS;
    this.storage = new Map();

    setInterval(() => {
      this.clearExpired();
    }, DEFAULT_STORAGE_EXPIRATION_CHECK);
  }

  get<T>(key: string): T | undefined {
    this.checkKeyIsExpired(key);
    return this.storage.get(key)?.value as T;
  }

  set(key: string, value: unknown, expMs?: number): void {
    const expirationTimeMs = expMs ?? this.defaultExpireMs;
    const data: TStoredData = {
      value,
      misc: {
        expire_at: Date.now() + expirationTimeMs,
      },
    };
    this.storage[key] = data;
  }

  del(key: string): void {
    this.storage.delete(key);
  }

  exists(key: string): boolean {
    this.checkKeyIsExpired(key);
    return this.storage.has(key);
  }

  private clearExpired(): void {
    Object.keys(this.storage).forEach((key) => {
      this.checkKeyIsExpired(key);
    });
  }

  private checkKeyIsExpired(key: string): void {
    const data = this.storage.get(key);
    if (data === undefined || Date.now() > data.misc.expire_at) {
      this.storage.delete(key);
    }
  }
}
