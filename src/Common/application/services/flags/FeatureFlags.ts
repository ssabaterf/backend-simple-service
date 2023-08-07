import {
  IFeatureFlags,
  IFeatureFlagsRepository,
} from "@common/domain/featureflags/interface";
import { FeatureFlag } from "@common/domain/featureflags/models";
import { ILogger } from "@common/domain/logger/interface";

export class FeatureFlagsService implements IFeatureFlags {
  constructor(
    private repository: IFeatureFlagsRepository,
    private logger: ILogger
  ) {}
  async getFlag(key: string): Promise<FeatureFlag | null> {
    this.logger.debug(`Getting flag ${key}`);
    return this.repository.getFlag(key);
  }
  async getFlags(): Promise<FeatureFlag[]> {
    this.logger.debug(`Getting all flags`);
    return this.repository.getFlags();
  }
}
