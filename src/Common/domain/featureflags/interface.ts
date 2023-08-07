import { Context } from "../context/context";
import { FeatureFlag } from "./models";

export interface IFeatureFlagsRepository {
  getFlag(key: string, context?: Context): Promise<FeatureFlag | null>;
  getFlags(context?: Context): Promise<FeatureFlag[]>;
}

export interface IFeatureFlags {
  getFlag(key: string, context?: Context): Promise<FeatureFlag | null>;
  getFlags(context?: Context): Promise<FeatureFlag[]>;
}
