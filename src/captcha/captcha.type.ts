import { TwoCaptcha } from './two-captcha';

export const CAPTCHA_PROVIDERS = {
  TWO_CAPTCHA: TwoCaptcha,
} as const;

export type TCaptchaProviders = (typeof CAPTCHA_PROVIDERS)[keyof typeof CAPTCHA_PROVIDERS];
