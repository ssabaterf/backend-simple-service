import {
  CreateExampleRequest,
  UpdateExampleRequest,
} from "Example/domain/dtos/Example";
import { Context } from "@common/domain/context/context";
import { Example } from "Example/domain/models/Example";

export interface IExampleRepository {
  getExample(id: string, ctx?: Context): Promise<Example | null>;
  getExamples(ctx?: Context): Promise<Example[]>;
  createExample(example: Example, ctx?: Context): Promise<Example>;
  updateExample(example: Example, ctx?: Context): Promise<Example>;
  deleteExample(id: string, ctx?: Context): Promise<void>;
}

export interface IExampleService {
  getExample(id: string, ctx?: Context): Promise<Example>;
  getExamples(ctx?: Context): Promise<Example[]>;
  createExample(example: CreateExampleRequest, ctx?: Context): Promise<Example>;
  updateExample(example: UpdateExampleRequest, ctx?: Context): Promise<Example>;
  deleteExample(id: string, ctx?: Context): Promise<void>;
}
