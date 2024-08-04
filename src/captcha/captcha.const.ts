export const CAPTCHA_TYPE = {
  RECAPTCHA_V2: 'RECAPTCHA_V2',
} as const;
export type TCaptchaType = (typeof CAPTCHA_TYPE)[keyof typeof CAPTCHA_TYPE];
