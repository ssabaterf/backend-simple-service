/**
 * Represents a cache item for a feature flag.
 * @interface
 */
export interface FeatureCacheItem {
  /**
   * The key associated with the feature flag cache item.
   * @type {string}
   */
  key: string;
  /**
   * The feature flag information.
   * @type {FeatureFlag}
   */
  feature: FeatureFlag;
  /**
   * The expiration date of the cache item.
   * @type {Date}
   */
  expires: Date;
}

/**
 * Represents a feature flag.
 * @interface
 */
export interface FeatureFlag {
  /**
   * The unique key of the feature flag.
   * @type {string}
   */
  key: string;
  /**
   * The value associated with the feature flag.
   * This can be a string, number, or boolean.
   * @type {string | number | boolean}
   */
  value: string | number | boolean;
  /**
   * The creation date of the feature flag.
   * @type {Date}
   */
  createdAt: Date;
  /**
   * The last update date of the feature flag.
   * @type {Date}
   */
  updatedAt: Date;
  /**
   * Indicates whether the feature flag is currently enabled or disabled.
   * @type {boolean}
   */
  enabled: boolean;
}
