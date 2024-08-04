export class ValidationError extends Error {
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

    this.name = 'ValidationError';
    this.description = `Validation error`;
    this.miscellaneous = miscellaneous;
  }
}
