import type Captcha from '@2captcha/captcha-solver';
import type { TCaptchaType } from '../captcha.const';
import type { TCaptchaConfig } from '../config.captcha.type';

export type TCaptchaAnswer = Awaited<ReturnType<Captcha.Solver['recaptcha']>>;

type TTaskQueueItem = {
  captchaConfig: TCaptchaConfig;
  status: 'processing' | 'recurring' | 'used' | 'expired';
  createTimestamp: number;
  endTimestamp: number;
  result?: string;
};

type TTaskQueueRecurringItem = {
  captchaConfig: TCaptchaConfig;
  status: 'recurring';
  captchaType: TCaptchaType;
  createTimestamp: number;
  endTimestamp: number;
  result: string;
};

export type TTaskQueue = Map<string, TTaskQueueItem | TTaskQueueRecurringItem>;
