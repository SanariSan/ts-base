import express from 'express';
import { createServer } from 'http';
import { DI } from './di';
import { setupHandleErrors } from './error';
import { setupSettings } from './settings';
import { ApiController } from './api/controller';
import { NotFoundError } from './api/errors';

const initServer = () => {
  const app = express();
  const server = createServer(app);

  server.on('error', (e: NodeJS.ErrnoException) => {
    if (e.code === 'EADDRINUSE' || e.code === 'EADDRNOTAVAIL') {
      setTimeout(() => {
        server.close();

        server.listen(Number(process.env.PORT ?? 80), process.env.HOST ?? '0.0.0.0');
      }, 60_000);
    }
  });

  setupSettings(app);

  const apiController = DI.resolve(ApiController);
  app.use(apiController.basePath, apiController.router);

  // app.use('/ping', syncHandleMW(ping));
  app.use(`*`, () => {
    throw new NotFoundError({ message: 'Route not found' });
  });

  setupHandleErrors(app);

  server
    .listen(Number(process.env.PORT ?? 80), process.env.HOST ?? '0.0.0.0', () => {
      console.log(`Server running on port : ${process.env.PORT ?? ':80'}`);
    })
    .on('error', (e) => {
      console.log(e);
    });
};

export { initServer };
