import * as Captcha from '@2captcha/captcha-solver';
import { DI } from '../../di';
import { randomHex, sleep } from '../../helpers';
import { Logger } from '../../logger';
import { CAPTCHA_TYPE } from '../captcha.const';
import type { TCaptchaConfig } from '../config.captcha.type';
import type { TCaptchaAnswer, TTaskQueue } from './two-captcha.type';

// todo: add 'used' | 'expired' statuses cleanup
export class TwoCaptcha {
  private readonly solver: Captcha.Solver;
  private readonly tasksQueue: TTaskQueue;

  constructor(private readonly logger: Logger) {
    if (process.env.TWO_CAPTCHA_API_KEY === undefined) {
      throw new Error('TWO_CAPTCHA_API_KEY is not defined');
    }

    this.solver = new Captcha.Solver(process.env.TWO_CAPTCHA_API_KEY);
    this.tasksQueue = new Map();
  }

  private getRecurringTaskId(captchaConfig: TCaptchaConfig): { id: string } | undefined {
    const entries = [...this.tasksQueue.entries()];

    for (let i = 0; i < this.tasksQueue.size; i += 1) {
      const [taskId, taskData] = entries[i];

      if (
        taskData.captchaConfig.captchaType === captchaConfig.captchaType &&
        taskData.status === 'recurring'
      ) {
        this.tasksQueue.set(taskId, {
          ...taskData,
          status: 'used',
        });

        return { id: taskId };
      }
    }

    return;
  }

  public getRecurringTasksCount(captchaConfig): number {
    return [...this.tasksQueue.values()].filter(
      (taskData) =>
        taskData.captchaConfig.captchaType === captchaConfig.captchaType &&
        taskData.status === 'recurring',
    ).length;
  }

  public async getAwaitedResult(captchaConfig: TCaptchaConfig): Promise<string> {
    let result: string | undefined;

    while (result === undefined) {
      const taskId = this.getRecurringTaskId(captchaConfig);

      if (taskId !== undefined) {
        result = this.tasksQueue.get(taskId.id)?.result;
      }

      await sleep(1000);
    }

    return result;
  }

  public getInstantResult(captchaConfig: TCaptchaConfig): string | undefined {
    const taskId = this.getRecurringTaskId(captchaConfig);
    if (taskId === undefined) return;

    const result: string | undefined = this.tasksQueue.get(taskId.id)?.result;
    return result;
  }

  public solveCaptcha(captchaConfig: TCaptchaConfig): Promise<{ id: string }> {
    switch (captchaConfig.captchaType) {
      case CAPTCHA_TYPE.RECAPTCHA_V2: {
        return this.recaptchaV2(captchaConfig);
      }
      default: {
        throw new Error('Unknown captcha type');
      }
    }
  }

  public async recaptchaV2(captchaConfig: TCaptchaConfig) {
    const rndId = await randomHex();
    const createTimestamp = Date.now();

    const req = this.solver.recaptcha({
      pageurl: captchaConfig.pageurl,
      googlekey: captchaConfig.sitekey,
    });

    this.tasksQueue.set(rndId, {
      status: 'processing',
      captchaConfig,
      createTimestamp,
      endTimestamp: Date.now() + 120_000,
    });

    await req
      .then((result: TCaptchaAnswer) => {
        this.logger.cli(
          'info',
          { provider: TwoCaptcha.name, captchaType: CAPTCHA_TYPE.RECAPTCHA_V2 },
          'Captcha solving finished',
        );
        this.tasksQueue.set(rndId, {
          status: 'recurring',
          captchaConfig,
          result: result.data,
          createTimestamp,
          endTimestamp: createTimestamp + 120_000,
        });

        setTimeout(() => {
          this.logger.cli(
            'info',
            { provider: TwoCaptcha.name, captchaType: CAPTCHA_TYPE.RECAPTCHA_V2 },
            'Captcha expired',
          );

          this.tasksQueue.set(rndId, {
            status: 'expired',
            captchaConfig,
            result: result.data,
            createTimestamp,
            endTimestamp: createTimestamp + 120_000,
          });
        }, 120_000);

        return;
      })
      .catch((error) => {
        this.logger.cli('info', error, 'recaptchaV2 error');
      });

    // currently id is not used outside of this class, however later I might add direct result access by id
    return {
      id: rndId,
    };
  }
}

DI.register(TwoCaptcha, [() => Logger]);
