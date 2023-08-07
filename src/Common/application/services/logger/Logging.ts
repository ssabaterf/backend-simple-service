import winston from "winston";
import { Context } from "@common/domain/context/context";
import { ILogger } from "@common/domain/logger/interface";
import { LogLevel, LogLevelType } from "@common/domain/logger/models";
import { generateTransportLayer } from "@common/infrastructure/logger/transportLayer";

/**
 * Logger class for logging messages with different log levels.
 */
export class LoggerService implements ILogger {
  private contextName: string;
  private contextMode: LogLevelType;
  private logger: winston.Logger;
  private transportLayer: winston.transport[];
  /**
   * Create a new instance of the Logger class.
   * @param {string} contextName - The name of the logger context.
   * @param {LogLevelType} [logLevel=LogLevel.info] - The log level to be set for the logger.
   */
  constructor(contextName: string, logLevel: LogLevelType = LogLevel.info) {
    this.contextName = contextName;
    this.contextMode = logLevel;

    this.transportLayer = generateTransportLayer();

    this.logger = winston.createLogger({
      level: this.contextMode,
      defaultMeta: { service: this.contextName },
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
        winston.format.metadata({
          fillExcept: ["message", "level", "timestamp", "label"],
        })
      ),
      transports: this.transportLayer,
    });
  }
  /**
   * Log an info message.
   * @param {string | unknown} message - The message to be logged.
   * @param {Context} [context] - Optional context information.
   */
  public info(message: string | unknown, context?: Context) {
    this.log(message, this.logger.info, context);
  }
  /**
   * Log an error message.
   * @param {string | unknown} message - The message to be logged.
   * @param {Context} [context] - Optional context information.
   */
  public error(message: string | unknown, context?: Context) {
    this.log(message, this.logger.error, context);
  }
  /**
   * Log a warning message.
   * @param {string | unknown} message - The message to be logged.
   * @param {Context} [context] - Optional context information.
   */
  public warn(message: string | unknown, context?: Context) {
    this.log(message, this.logger.warn, context);
  }
  /**
   * Log a debug message.
   * @param {string | unknown} message - The message to be logged.
   * @param {Context} [context] - Optional context information.
   */
  public debug(message: string | unknown, context?: Context) {
    this.log(message, this.logger.debug, context);
  }
  /**
   * Log a verbose message.
   * @param {string | unknown} message - The message to be logged.
   * @param {Context} [context] - Optional context information.
   */
  public verbose(message: string | unknown, context?: Context) {
    this.log(message, this.logger.verbose, context);
  }
  /**
   * Log an http message.
   * @param {string | unknown} message - The message to be logged.
   * @param {Context} [context] - Optional context information.
   */
  public http(message: string | unknown, context?: Context) {
    this.log(message, this.logger.http, context);
  }
  /**
   * Log a silly message.
   * @param {string | unknown} message - The message to be logged.
   * @param {Context} [context] - Optional context information.
   */
  public silly(message: string | unknown, context?: Context) {
    this.log(message, this.logger.silly, context);
  }
  /*
   * Get the transport layer of the logger.
   * @returns {winston.transport[]} - The transport layer of the logger.
   */
  public getTransportLayer(): winston.transport[] {
    return this.transportLayer;
  }
  /**
   * Private method to handle logging messages with the given log function.
   * @param {string | unknown} message - The message to be logged.
   * @param {(message: string, ...meta: unknown[]) => void} logFunction - The log function to be used for logging.
   * @param {Context} [context] - Optional context information.
   * @private
   */
  private log(
    message: string | unknown,
    logFunction: (message: string, ...meta: unknown[]) => void,
    context?: Context
  ) {
    if (!logFunction) return;
    let logLine = "";
    switch (typeof message) {
      case "string":
        logLine = message;
        break;
      case "object":
        logLine = JSON.stringify(message);
        break;
      case "number":
        logLine = message.toString();
        break;
      case "boolean":
        logLine = message.toString();
        break;
      case "undefined":
        logLine = `undefined`;
        break;
      default:
        logLine = `Unknown Error`;
    }
    const elapsed = context
      ? new Date().getTime() - context.startTime.getTime()
      : null;
    const requestId = context ? context.requestId : null;
    logFunction(`${logLine}`, { requestId: requestId, elapsedTime: elapsed });
  }
}
