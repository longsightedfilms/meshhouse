import { createLogger, format, transports } from 'winston';

const logger = createLogger({
  level: 'debug',
  format: format.combine(
    format.colorize(),
    format.timestamp(),
    format.printf((info) => `${info.level} ${info.timestamp} [${info.service}]: ${info.message}`),
    format.errors({ stack: true })
  ),
  transports: [
    new transports.Console()
  ],
  handleExceptions: true,
  exceptionHandlers: [
    new transports.Console()
  ],
  defaultMeta: {
    service: 'MeshHouse'
  },
  exitOnError: false
});

export default logger;
