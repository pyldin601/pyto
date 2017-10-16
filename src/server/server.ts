import * as koaBetterStatic from 'koa-better-static2';
import * as koaViews from 'koa-views';

import config from './config';
import winston from './services/winston';
import router from './routes';

import createApp from './app';

const app = createApp();

app.use(koaBetterStatic('public'));
app.use(koaViews('views'));
app.use(router.routes());
app.use(router.allowedMethods());

app.listen(config.SERVER_PORT, () => {
  winston.info(`Service is listening at port ${config.SERVER_PORT}`);
});
