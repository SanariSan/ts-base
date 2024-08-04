import type { TCaptchaType } from './captcha.const';
import type { TCaptchaProviders } from './captcha.type';

export type TCaptchaConfig = {
  captchaType: TCaptchaType;
  provider: TCaptchaProviders;
  pageurl: string;
  sitekey: string;
  bgSolvingRateMs: number;
  shouldAutoControlBgSolvingRate: boolean;
  recurringTasksTresholdQty: number;
};

export type TCaptchaConfigs = Record<string, TCaptchaConfig>;
