import * as Koa from 'koa';
import { devMiddleware } from 'koa-webpack-middleware'
import * as webpack from 'webpack';

import config from './config';
import * as webpackConfig from '../client/webpack.config.js';

export default () => {
  const app = new Koa();

  if (!config.IS_PRODUCTION) {
    app.use(devMiddleware(webpack(webpackConfig), {
      noInfo: false,
      quiet: false,
      lazy: true,

      publicPath: '/assets/',

      stats: {
        colors: true
      }
    }));
  }

  return app;
}
