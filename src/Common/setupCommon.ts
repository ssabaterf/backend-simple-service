import { Router } from "express";
import { FeatureFlagsService } from "./application/services/flags/FeatureFlags";
import { LoggerService } from "./application/services/logger/Logging";
import {
  IFeatureFlags,
  IFeatureFlagsRepository,
} from "./domain/featureflags/interface";
import { ApplicationConfig } from "./infrastructure/config/ApplicationConfig";
import { MongoDatabase } from "./infrastructure/database/MongoDB";
import { FeatureFlagsController } from "./infrastructure/http/controllers/FeatureFlagsController";
import { GetFeatureFlagRouter } from "./infrastructure/http/routes/FeatureFlagRouter";
import { FeatureFlagRepository } from "./infrastructure/repositories/FeatureFlagsRepository";

export async function setupShared(): Promise<{
  settings: ApplicationConfig;
  db: MongoDatabase;
  featureFlags: {
    repository: IFeatureFlagsRepository;
    service: IFeatureFlags;
    controller: FeatureFlagsController;
    router: Router;
  };
}> {
  //Initialize the application
  const configLogger = new LoggerService(ApplicationConfig.name, "info");
  const settings = new ApplicationConfig(configLogger);
  settings.loadFromFiles("./config.json");
  settings.loadFromEnvironment();

  //Initialize the database and persistances
  const dbLogger = new LoggerService(MongoDatabase.name, "info");
  const db = new MongoDatabase(settings, dbLogger);
  await db.connect();

  //Initialize the feature flags
  const featureLogger = new LoggerService("FeatureFlags", "info");
  const featureRepo = new FeatureFlagRepository(
    await db.getCollection("FeatureFlags"),
    featureLogger
  );
  const featureService = new FeatureFlagsService(featureRepo, featureLogger);
  const featureController = new FeatureFlagsController(
    featureService,
    featureLogger
  );
  const featureRouter = GetFeatureFlagRouter(featureController);

  return {
    settings,
    db,
    featureFlags: {
      service: featureService,
      controller: featureController,
      router: featureRouter,
      repository: featureRepo,
    },
  };
}
