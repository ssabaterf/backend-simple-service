import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

/**
 * Retrieves the appropriate transport layer based on the environment.
 * @returns {Array} An array of winston transports.
 */
export function generateTransportLayer() {
  if (process.env.NODE_ENV === "production") {
    return getProductionTransport();
  }
  return getDevelopmentTransport();
}

/**
 * Retrieves the transport layer for the production environment.
 * @returns {Array} An array of winston transports for production.
 */
function getProductionTransport() {
  const transport1 = new DailyRotateFile({
    filename: "./log/application-%DATE%.log",
    datePattern: "YYYY-MM-DD-HH",
    maxSize: "20m",
    maxFiles: "14d",
    level: "debug",
  });
  const transport2 = new DailyRotateFile({
    level: "error",
    filename: "./log/application-error-%DATE%.log",
    datePattern: "YYYY-MM-DD-HH",
    zippedArchive: true,
    maxSize: "20m",
    maxFiles: "14d",
  });
  const transport3 = new winston.transports.Console({
    level: "error",
    format: customFormat(),
  });
  return [transport1, transport2, transport3];
}

/**
 * Retrieves the transport layer for the development environment.
 * @returns {Array} An array of winston transports for development.
 */
function getDevelopmentTransport() {
  const transport1 = new winston.transports.Console({
    format: winston.format.combine(winston.format.cli(), customFormat()),
  });
  const transport2 = new winston.transports.File({
    filename: "./log/error.log",
    level: "error",
    maxsize: 5242880,
    maxFiles: 10,
  });
  const transport3 = new winston.transports.File({
    filename: "./log/all.log",
    level: "debug",
    maxsize: 5242880,
    maxFiles: 10,
  });
  return [transport1, transport2, transport3];
}

/**
 * Defines a custom log format for winston.
 * @returns {winston.Logform.Format} The custom log format.
 */
function customFormat() {
  return winston.format.printf(
    ({ level, message, timestamp, stack, metadata }) => {
      return `${timestamp ? timestamp : new Date().toISOString()} [${level}] ${
        metadata ? metadata.service : "HttpServer"
      }: ${stack || message}`;
    }
  );
}
