import { Captcha } from '../captcha';
import { CAPTCHA_CONFIGS } from '../captcha/config.captcha';
import { DI } from '../di';

export const captchaExample = async () => {
  const captcha = DI.resolve(Captcha);

  captcha.startBgSolving(CAPTCHA_CONFIGS.SAMPLE);

  const result = await captcha.getResult(CAPTCHA_CONFIGS.SAMPLE);

  // captcha.stopBgSolving(CAPTCHA_CONFIGS.SAMPLE);

  return result;
};
