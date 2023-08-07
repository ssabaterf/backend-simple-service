import { IFeatureFlags } from "@common/domain/featureflags/interface";
import { ILogger } from "@common/domain/logger/interface";
import { NextFunction, Request, Response } from "express";

export class FeatureFlagsController {
  constructor(
    private featureFlagsService: IFeatureFlags,
    private logger: ILogger
  ) {}

  public async getFeatureFlags(
    _req: Request,
    res: Response,
    next: NextFunction
  ) {
    this.logger.debug("Getting all feature flags");
    try {
      const featureFlags = await this.featureFlagsService.getFlags();
      return res.status(200).json(featureFlags);
    } catch (error) {
      return next(error);
    }
  }

  public async getFlag(req: Request, res: Response, next: NextFunction) {
    const flagName = req.params.flagName;
    try {
      const flag = await this.featureFlagsService.getFlag(flagName);
      return res.status(200).json(flag);
    } catch (error) {
      return next(error);
    }
  }
}
