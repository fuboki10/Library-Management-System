import { transports, format } from 'winston';
import {
  WinstonModule,
  utilities as nestWinstonModuleUtilities,
} from 'nest-winston';
import { getCurrentTimestamp } from './time';

export const LoggerFactory = (appName: string) => {
  let consoleFormat;

  const DEBUG = process.env.DEBUG;
  const USE_JSON_LOGGER = process.env.USE_JSON_LOGGER;
  const PROD = process.env.NODE_ENV === 'production';

  if (USE_JSON_LOGGER === 'true') {
    consoleFormat = format.combine(
      format.ms(),
      format.timestamp(),
      format.json(),
    );
  } else {
    consoleFormat = format.combine(
      format.timestamp(),
      format.ms(),
      nestWinstonModuleUtilities.format.nestLike(appName, {
        colors: !PROD,
        prettyPrint: !PROD,
      }),
    );
  }

  return WinstonModule.createLogger({
    level: DEBUG ? 'debug' : 'info',
    transports: PROD
      ? [new transports.Console({ format: consoleFormat })]
      : [
          new transports.Console({ format: consoleFormat }),
          new transports.File({
            dirname: `${process.env.PWD}/logs`,
            filename: `${appName}-${getCurrentTimestamp()}.log`,
          }),
        ],
  });
};
