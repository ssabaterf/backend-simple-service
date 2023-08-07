import { generateTransportLayer } from "@common/infrastructure/logger/transportLayer";
import * as ew from "express-winston";
import winston from "winston";

export function LoggerHttp() {
  const transportLayer = generateTransportLayer();
  transportLayer.forEach((transport) => {
    transport.format = undefined;
  });
  return ew.logger({
    transports: transportLayer,
    format: winston.format.json(),
    meta: true,
    msg: "HTTP {{req.method}} {{req.url}}",
    expressFormat: true,
    colorize: false,
  });
}
