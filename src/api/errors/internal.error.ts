export class InternalError extends Error {
  public name: string;
  public description: string;
  public miscellaneous?: Record<string, unknown>;

  constructor({
    message,
    miscellaneous,
  }: {
    message: string;
    miscellaneous?: Record<string, unknown>;
  }) {
    super(message);

    this.name = 'InternalError';
    this.description = `Internal server error`;
    this.miscellaneous = miscellaneous;
  }
}
