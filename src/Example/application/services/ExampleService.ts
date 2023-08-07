import { PlatformError } from "@common/domain/errors/Errors";
import {
  CreateExampleRequest,
  UpdateExampleRequest,
} from "Example/domain/dtos/Example";
import {
  IExampleRepository,
  IExampleService,
} from "Example/domain/interfaces/Example";
import { Context } from "@common/domain/context/context";
import { Example } from "Example/domain/models/Example";
import { ILogger } from "@common/domain/logger/interface";

export class ExampleService implements IExampleService {
  constructor(
    private repo: IExampleRepository,
    private logger: ILogger
  ) {}

  async getExample(id: string, ctx?: Context): Promise<Example> {
    this.logger.debug(`Getting example with id ${id}`, ctx);
    const example = await this.repo.getExample(id, ctx);
    if (!example) {
      this.logger.error(`Example with id ${id} not found`, ctx);
      throw PlatformError.NotFound("Example not found");
    }
    return example;
  }

  async getExamples(ctx?: Context): Promise<Example[]> {
    this.logger.debug(`Getting all examples`, ctx);
    return this.repo.getExamples(ctx);
  }

  async createExample(
    example: CreateExampleRequest,
    ctx?: Context
  ): Promise<Example> {
    this.logger.debug(`Creating example with name ${example.name}`, ctx);
    const exampleModel = new Example(example.name, example.description);
    return this.repo.createExample(exampleModel, ctx);
  }

  async updateExample(
    example: UpdateExampleRequest,
    ctx?: Context
  ): Promise<Example> {
    this.logger.debug(`Updating example with id ${example.id}`, ctx);
    const exampleModel = await this.getExample(example.id, ctx);
    exampleModel.description = example.description;
    return this.repo.updateExample(exampleModel, ctx);
  }

  async deleteExample(id: string, ctx?: Context): Promise<void> {
    this.logger.debug(`Deleting example with id ${id}`, ctx);
    this.repo.deleteExample(id, ctx);
  }
}
