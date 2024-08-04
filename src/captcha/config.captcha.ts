import { CAPTCHA_TYPE } from './captcha.const';
import { CAPTCHA_PROVIDERS } from './captcha.type';
import type { TCaptchaConfigs } from './config.captcha.type';

export const CAPTCHA_CONFIGS = {
  SAMPLE: {
    captchaType: CAPTCHA_TYPE.RECAPTCHA_V2,
    provider: CAPTCHA_PROVIDERS.TWO_CAPTCHA,
    pageurl: 'https://maindomain.com',
    sitekey: '12345abcde',
    bgSolvingRateMs: 10_000,
    shouldAutoControlBgSolvingRate: true,
    recurringTasksTresholdQty: 3,
  },
} satisfies TCaptchaConfigs;
