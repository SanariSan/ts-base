// import { CAPTCHA_CONFIGS, Captcha } from './captcha';
import { DI } from './di';
import { Logger } from './logger';
import { Mongo } from './mongo';
import { initServer } from './server';

async function init() {
  initServer();
  const logger = DI.resolve(Logger);
  await DI.resolve(Mongo).getInstance();
  // DI.resolve(Captcha).startBgSolving(CAPTCHA_CONFIGS.SAMPLE);

  logger.cli('info', 'test');
}

void init();
