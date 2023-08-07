import { Router } from "express";
import { FeatureFlagsController } from "../controllers/FeatureFlagsController";

export function GetFeatureFlagRouter(controller: FeatureFlagsController) {
  const router = Router();
  router.get("/", controller.getFeatureFlags.bind(controller));
  router.get("/:flagName", controller.getFlag.bind(controller));
  return router;
}
