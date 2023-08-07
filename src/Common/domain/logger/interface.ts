import winston from "winston";
import { Context } from "../context/context";

export interface ILogger {
  info(message: string | unknown, context?: Context): void;
  error(message: string | unknown, context?: Context): void;
  warn(message: string | unknown, context?: Context): void;
  debug(message: string | unknown, context?: Context): void;
  verbose(message: string | unknown, context?: Context): void;
  http(message: string | unknown, context?: Context): void;
  silly(message: string | unknown, context?: Context): void;
  getTransportLayer(): winston.transport[];
}
