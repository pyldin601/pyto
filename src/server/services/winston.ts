import * as winston from 'winston';

winston.configure({
  transports: [
    new winston.transports.Console(),
  ],
});

export default winston;
