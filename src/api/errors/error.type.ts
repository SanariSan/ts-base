export interface IGenericError extends Error {
  name: string;
  description: string;
  miscellaneous?: Record<string, unknown>;
}
