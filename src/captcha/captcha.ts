import { DI } from '../di';
import { sleep } from '../helpers';
import { Logger } from '../logger';
import type { TCaptchaConfig } from './config.captcha.type';

export class Captcha {
  private readonly isBgSolving: Map<TCaptchaConfig, boolean> = new Map();

  constructor(private readonly logger: Logger) {}

  public solveCaptcha(captchaConfig: TCaptchaConfig): Promise<{ id: string }> {
    this.logger.cli('info', { captchaConfig }, 'Captcha solving requested');

    return DI.resolve(captchaConfig.provider).solveCaptcha(captchaConfig);
  }

  public getAwaitedResult(captchaConfig: TCaptchaConfig): Promise<string> {
    return DI.resolve(captchaConfig.provider).getAwaitedResult(captchaConfig);
  }

  public getInstantResult(captchaConfig: TCaptchaConfig): string | undefined {
    return DI.resolve(captchaConfig.provider).getInstantResult(captchaConfig);
  }

  /**
   * Mainly you will use this method to obtain the captcha result token.
   * Attemp to get pre-solved result, if it's not available call captcha solver and wait for result.
   * This allows to combine bg solver with immediate triggering when it's needed.
   */
  public async getResult(captchaConfig: TCaptchaConfig): Promise<string> {
    const instantResult = this.getInstantResult(captchaConfig);

    if (instantResult === undefined) {
      this.logger.cli('warn', { instantResult }, 'Instant result is undefined, solving');
      void this.solveCaptcha(captchaConfig);
    }

    return await this.getAwaitedResult(captchaConfig);
  }

  public startBgSolving(captchaConfig: TCaptchaConfig) {
    this.initBgSolving(captchaConfig);

    if (this.isBgSolving.get(captchaConfig) === false) {
      this.isBgSolving.set(captchaConfig, true);

      void this.bgTask(captchaConfig).catch((error) => {
        this.logger.cli('error', error, 'bgTask error');
      });
    }
  }

  public stopBgSolving(captchaConfig: TCaptchaConfig) {
    this.initBgSolving(captchaConfig);

    this.isBgSolving.set(captchaConfig, false);
  }

  private initBgSolving(captchaConfig: TCaptchaConfig) {
    if (!this.isBgSolving.has(captchaConfig)) this.isBgSolving.set(captchaConfig, false);
  }

  private async bgTask(captchaConfig: TCaptchaConfig) {
    this.initBgSolving(captchaConfig);

    if (this.isBgSolving.get(captchaConfig) === false) return;

    // it will skip bg solves until some tasks expire or be used
    if (captchaConfig.shouldAutoControlBgSolvingRate) {
      const recurringTasksCount = DI.resolve(captchaConfig.provider).getRecurringTasksCount(
        captchaConfig,
      );

      this.logger.cli(
        'info',
        { captchaConfig, recurringTasksCount },
        'Recurring tasks check completed',
      );

      if (recurringTasksCount >= captchaConfig.recurringTasksTresholdQty) {
        this.logger.cli('info', 'Too many recurring tasks, skipping bg solving');

        await sleep(captchaConfig.bgSolvingRateMs);
        void this.bgTask(captchaConfig);
        return;
      }
    }

    void this.solveCaptcha(captchaConfig);

    await sleep(captchaConfig.bgSolvingRateMs);
    void this.bgTask(captchaConfig);
  }
}
DI.register(Captcha, [() => Logger]);
