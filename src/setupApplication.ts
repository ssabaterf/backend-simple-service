import { setupShared } from "@common/setupCommon";
import { setupExample } from "Example/setupExample";

export async function setupApplication() {
  //Initialize the Shared
  const shared = await setupShared();
  //Initialize the Example
  const example = await setupExample(shared.db);

  //Initialize the application

  return {
    settings: shared.settings,
    feature: shared.featureFlags,
    db: shared.db,
    example,
  };
}
