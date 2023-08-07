import express, { Request, Response, Express } from "express";
import { setupApplication } from "./setupApplication";
import { NextFunction } from "express";
import { parseError } from "@common/domain/errors/parser";
import { LoggerHttp } from "@common/infrastructure/http/middleware/loggerHttp";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      appContext: {
        startTime: Date;
        requestId: string;
      };
    }
  }
}

async function main() {
  const application = await setupApplication();
  const app = createExpressServer();

  app.use("/api/examples", application.example.router);
  app.use("/api/featureflags", application.feature.router);

  addFinalHandlers(app);
  app.listen(application.settings.config.port, () => {
    console.log("Server started on port 3000");
  });
}

function createExpressServer(): Express {
  const app = express();
  app.use(express.json());
  app.use((req, res, next) => {
    req.appContext = {
      startTime: new Date(),
      requestId:
        Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15),
    };
    next();
  });

  return app;
}

function addFinalHandlers(app: Express) {
  //Error logger
  app.use(LoggerHttp());
  //404 Handler
  app.use((req, res) => {
    res.status(404).json({ error: "Not found22" });
  });
  //Unhandled Error Handler
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  app.use((err: unknown, req: Request, res: Response, _next: NextFunction) => {
    const error = parseError(err);
    res.status(error.code).json({
      requestId: req.appContext.requestId,
      timestamp: new Date().toISOString(),
      ...error,
    });
  });
}

main();
