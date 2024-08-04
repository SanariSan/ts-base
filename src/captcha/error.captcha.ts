export class CaptchaExpiredError extends Error {
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

    this.name = 'CaptchaExpiredError';
    this.description = `Captcha expired`;
    this.miscellaneous = miscellaneous;
  }
}
