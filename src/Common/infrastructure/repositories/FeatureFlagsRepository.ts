import { IFeatureFlagsRepository } from "@common/domain/featureflags/interface";
import { FeatureFlag } from "@common/domain/featureflags/models";
import { ILogger } from "@common/domain/logger/interface";
import { Collection } from "mongodb";

export class FeatureFlagRepository implements IFeatureFlagsRepository {
  private cache: {
    [key: string]: { key: string; feature: FeatureFlag; expires: Date };
  } = {};
  private expirationTime = 1000 * 60 * 2; // 2 minutes

  constructor(
    private collection: Collection<FeatureFlag>,
    private logger: ILogger
  ) {
    this.reloadAllFlags();
  }

  /*
   * Reload all flags from the database
   */
  private async reloadAllFlags() {
    this.logger.debug("Reloading all flags");
    const flags = await this.collection!.find({}).toArray();
    flags.forEach((flag) => {
      this.cache[flag.key] = {
        key: flag.key,
        feature: flag,
        expires: new Date(new Date().getTime() * this.expirationTime),
      };
    });
  }

  /*
   * Get a flag from the cache
   * @param key - The key of the flag
   * @returns The flag or null if the flag is not found
   */
  public async getFlag(key: string): Promise<FeatureFlag | null> {
    this.logger.debug(`Getting flag ${key}`);
    const cachedFlag = this.cache[key];
    if (cachedFlag && cachedFlag.expires < new Date()) {
      this.reloadAllFlags();
    }
    return this.cache[key] ? this.cache[key].feature : null;
  }
  /*
   * Get all flags
   * @returns All flags
   *
   */
  public async getFlags(): Promise<FeatureFlag[]> {
    this.logger.debug(`Getting all flags`);
    this.reloadAllFlags();
    return Object.values(this.cache).map((flag) => flag.feature);
  }
}
