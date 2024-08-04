import { randomBytes } from 'node:crypto';

export const sleep = (ms: number) => new Promise<undefined>((resolve) => setTimeout(resolve, ms));

export const randomHex = (length = 16): Promise<string> =>
  new Promise((resolve, reject) => {
    randomBytes(length, (err, buffer) => {
      if (err) reject(err);
      resolve(buffer.toString('hex').slice(0, length));
    });
  });

export const randomHexSync = (length = 16): string =>
  randomBytes(length).toString('hex').slice(0, length);

export const raceWithTimeout = async <T>({
  promises,
  timeout = 60_000,
}: {
  promises: T | PromiseLike<T> | Iterable<T | PromiseLike<T>>;
  timeout?: number;
}) => {
  const promiseArray: Array<Promise<T>> = [];
  const forcedExpiration = new Promise<never>((resolve, reject) =>
    setTimeout(() => {
      reject(new Error(`raceWithTimeout rejected | ${timeout}ms timeout expired`));
    }, timeout),
  );

  if (Array.isArray(promises)) {
    promiseArray.push(...promises, forcedExpiration);
  } else {
    promiseArray.push(promises as Promise<T>, forcedExpiration);
  }

  return Promise.race(promiseArray);
};
