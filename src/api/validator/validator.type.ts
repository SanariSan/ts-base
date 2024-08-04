export type TClass = new (...args: unknown[]) => object;

export enum EVALIDATION_TARGET {
  BODY = 'body',
  HEADER = 'headers',
  QUERY = 'query',
  PARAM = 'params',
}
