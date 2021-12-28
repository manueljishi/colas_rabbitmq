const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, prettyPrint, simple } = format;
require('dotenv').config();


class Logger {
  constructor() {
    this.loggers = {
      console
    }
    this.logger = createLogger({
      level: 'info',
      format: combine(
        timestamp(),
        label({ label: process.env.WORKER_ID }),
        simple(),
      ),
      transports: [

        new transports.File({ filename: `${process.env.LOG_PATH}error.log`, level: 'error' }),
        new transports.File({ filename: `${process.env.LOG_PATH}combined.log` }),
      ],
    });
    if (process.env.NODE_ENV !== 'production') {
      this.logger.add(new transports.Console({
        format: simple(),
        level: 'silly'
      }));
    }
  }
}
exports.Logger = Logger;