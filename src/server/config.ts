export default {
  SERVER_PORT: process.env.PORT || 8080,
  IS_PRODUCTION: process.env.NODE_ENV == 'production',
};
