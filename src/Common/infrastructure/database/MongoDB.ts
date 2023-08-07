import * as mongoDB from "mongodb";
import { ILogger } from "@common/domain/logger/interface";
import { ApplicationConfig } from "../config/ApplicationConfig";

/**
 * Represents a MongoDB database client and provides methods to connect, disconnect,
 * and access collections within the database.
 */
export class MongoDatabase {
  private client: mongoDB.MongoClient;
  private db: mongoDB.Db | undefined;

  /**
   * Creates an instance of MongoDatabase.
   * @param {ApplicationConfig} config - The application configuration containing MongoDB connection details.
   */
  constructor(
    private config: ApplicationConfig,
    private Logger: ILogger
  ) {
    this.client = new mongoDB.MongoClient(
      this.config.getMongoDBConnectionString()
    );
  }

  /**
   * Connects to the MongoDB database using the provided connection string in the configuration.
   * @throws {Error} Throws an error if the client is already initialized or if the database is already connected.
   */
  async connect() {
    if (!this.client) {
      this.Logger.error("Client not initialized");
      throw new Error("Client not initialized");
    }
    if (this.db) {
      this.Logger.error("Database already connected");
      throw new Error("Database already connected");
    }
    await this.client.connect();
    this.db = this.client.db(this.config.config.database.dbname);
    this.Logger.info(`Connected to database ${this.config.getDbName()}`);
  }

  /**
   * Disconnects from the MongoDB database.
   */
  async disconnect() {
    this.client.close();
    this.Logger.info(`Disconnected from database ${this.config.getDbName()}`);
  }
  /**
   * Retrieves a MongoDB collection from the connected database.
   * @template T - The type of the collection documents.
   * @param {string} collectionName - The name of the collection to retrieve.
   * @returns {Promise<mongoDB.Collection<T>>} The MongoDB collection.
   * @throws {Error} Throws an error if the database is not connected.
   */
  async getCollection<T extends mongoDB.BSON.Document>(collectionName: string) {
    if (!this.db) {
      this.Logger.error("Database not connected");
      throw new Error("Database not connected");
    }
    this.Logger.info(`Getting collection ${collectionName}`);
    return this.db.collection<T>(collectionName);
  }
}
