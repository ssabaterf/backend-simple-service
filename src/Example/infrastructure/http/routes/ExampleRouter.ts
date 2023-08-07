import { Router } from "express";
import { ExampleController } from "../controllers/ExampleController";

export function GetExampleRouter(exampleController: ExampleController) {
  const router = Router();
  router.post("/", exampleController.postCreateExample.bind(exampleController));
  router.get("/", exampleController.getExamples.bind(exampleController));
  router.get("/:id", exampleController.getExample.bind(exampleController));
  router.patch(
    "/:id",
    exampleController.patchUpdateExample.bind(exampleController)
  );
  router.delete(
    "/:id",
    exampleController.deleteExample.bind(exampleController)
  );
  return router;
}
