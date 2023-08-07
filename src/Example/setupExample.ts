import { MongoDatabase } from "@common/infrastructure/database/MongoDB";
import { ExampleRepository } from "./infrastructure/repositories/ExampleRepository";
import { ExampleService } from "./application/services/ExampleService";
import { LoggerService } from "@common/application/services/logger/Logging";
import { ExampleController } from "./infrastructure/http/controllers/ExampleController";
import { GetExampleRouter } from "./infrastructure/http/routes/ExampleRouter";

export async function setupExample(db: MongoDatabase) {
  const repository = new ExampleRepository(
    await db.getCollection("Examples"),
    new LoggerService(ExampleRepository.name, "info")
  );
  const service = new ExampleService(
    repository,
    new LoggerService(ExampleService.name, "info")
  );
  const controller = new ExampleController(
    service,
    new LoggerService(ExampleController.name, "info")
  );
  const router = GetExampleRouter(controller);
  return {
    repository,
    service,
    controller,
    router,
  };
}
