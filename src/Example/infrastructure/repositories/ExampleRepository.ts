import { Context } from "@common/domain/context/context";
import { Example } from "Example/domain/models/Example";
import { IExampleRepository } from "Example/domain/interfaces/Example";
import { ILogger } from "@common/domain/logger/interface";
import { Collection } from "mongodb";

export class ExampleRepository implements IExampleRepository {
  constructor(
    private collection: Collection<Example>,
    private logger: ILogger
  ) {}

  getExample(id: string, ctx?: Context): Promise<Example | null> {
    this.logger.debug(`Getting example with id ${id}`, ctx);
    return this.collection.findOne({ id: id });
  }
  getExamples(ctx?: Context | undefined): Promise<Example[]> {
    this.logger.debug(`Getting all examples`, ctx);
    return this.collection.find().toArray();
  }
  createExample(example: Example, ctx?: Context | undefined): Promise<Example> {
    this.logger.debug(`Creating example with id ${example.id}`, ctx);
    return this.collection.insertOne(example).then(() => example);
  }
  updateExample(example: Example, ctx?: Context | undefined): Promise<Example> {
    this.logger.debug(`Updating example with id ${example.id}`, ctx);
    return this.collection
      .updateOne({ id: example.id }, { $set: example })
      .then(() => example);
  }
  deleteExample(id: string): Promise<void> {
    this.logger.debug(`Deleting example with id ${id}`);
    return this.collection.deleteOne({ id: id }).then(() => {});
  }
}
