import fs from "fs";
import dotenv from "dotenv";
import { ILogger } from "@common/domain/logger/interface";

/**
 * Represents the application configuration class.
 */
export class ApplicationConfig {
  public config: Config;

  /**
   * Creates an instance of ApplicationConfig.
   * Initializes the default configuration with basic values.
   */
  constructor(private logger: ILogger) {
    dotenv.config();
    this.config = {
      port: 3000,
      host: "localhost",
      applicationName: "Express Server",
      database: {
        host: "localhost",
        port: 3306,
        username: null,
        password: null,
        dbname: "test",
      },
    };
  }

  /**
   * Loads configuration from environment variables.
   * Overrides the default values if environment variables are set.
   */
  public loadFromEnvironment(): void {
    this.config.port = Number(process.env.APP_PORT) || this.config.port;
    this.config.host = process.env.APP_HOST || this.config.host;
    this.config.applicationName =
      process.env.APP_NAME || this.config.applicationName;
    this.config.database.host =
      process.env.DATABASE_HOST || this.config.database.host;
    this.config.database.port =
      Number(process.env.DATABASE_PORT) || this.config.database.port;
    this.config.database.username =
      process.env.DATABASE_USERNAME || this.config.database.username;
    this.config.database.password =
      process.env.DATABASE_PASSWORD || this.config.database.password;
    this.config.database.dbname =
      process.env.DATABASE_NAME || this.config.database.dbname;

    this.logger.info({
      message: "Loaded configuration from environment",
      details: this.config,
    });
  }

  /**
   * Loads configuration from a JSON file.
   * Overrides the default values if the file is valid and contains configuration data.
   * @param {string} path - The path to the JSON configuration file.
   */
  public loadFromFiles(path: string): void {
    try {
      const data = fs.readFileSync(path, "utf-8");
      const config = JSON.parse(data);
      this.config.port = config.port || this.config.port;
      this.config.host = config.host || this.config.host;
      this.config.applicationName =
        config.applicationName || this.config.applicationName;
      this.config.database.host =
        config.database.host || this.config.database.host;
      this.config.database.port =
        config.database.port || this.config.database.port;
      this.config.database.username =
        config.database.username || this.config.database.username;
      this.config.database.password =
        config.database.password || this.config.database.password;
      this.config.database.dbname =
        config.database.dbname || this.config.database.dbname;

      this.logger.info({
        message: "Loaded configuration from file",
        details: this.config,
      });
    } catch (err) {
      this.logger.error(
        `Error loading configuration from file ${path}\n${err}`
      );
    }
  }

  /**
   * Retrieves the MongoDB connection string based on the configuration.
   * @returns {string} The MongoDB connection string.
   */
  public getMongoDBConnectionString(): string {
    if (this.config.database.username && this.config.database.password) {
      return `mongodb://${this.config.database.username}:${this.config.database.password}@${this.config.database.host}`;
    }
    return `mongodb://${this.config.database.host}:${this.config.database.port}`;
  }

  /**
   * Retrieves the name of the database.
   * @returns {string} The name of the database.
   */
  public getDbName(): string {
    return this.config.database.dbname;
  }
}
/**
 * Represents the configuration object for the application.
 * @interface
 */
export interface Config {
  port: number;
  host: string;
  applicationName: string;
  database: DatabaseConfig;
}
/**
 * Represents the database configuration object.
 * @interface
 */
export interface DatabaseConfig {
  host: string;
  port: number;
  username: string | null;
  password: string | null;
  dbname: string;
}
