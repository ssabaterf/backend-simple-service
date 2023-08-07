import { IExampleService } from "Example/domain/interfaces/Example";
import { NextFunction, Request, Response } from "express";
import { ILogger } from "@common/domain/logger/interface";

/**
 * ExampleController class handles incoming HTTP requests related to examples and delegates
 * the request processing to the IExampleService.
 */
export class ExampleController {
  /**
   * Creates an instance of ExampleController.
   * @param {IExampleService} exService - The instance of IExampleService for handling example-related operations.
   */
  constructor(
    private exService: IExampleService,
    private logger: ILogger
  ) {}

  /**
   * Handles the POST request to create a new example.
   * @async
   * @param {Request} req - The express Request object containing the request data.
   * @param {Response} res - The express Response object for sending the response.
   * @param {NextFunction} next - The express NextFunction for handling errors.
   */
  async postCreateExample(req: Request, res: Response, next: NextFunction) {
    const context = req.appContext;
    this.logger.info(`Request received to create example`, context);
    try {
      const example = await this.exService.createExample(req.body, context);
      res.status(201).json(example);
    } catch (err) {
      this.logger.error(`Error creating example`, context);
      this.logger.debug(err, context);
      next(err);
    }
  }

  /**
   * Handles the GET request to retrieve all examples.
   * @async
   * @param {Request} _req - The express Request object (not used in this method).
   * @param {Response} res - The express Response object for sending the response.
   * @param {NextFunction} next - The express NextFunction for handling errors.
   */
  async getExamples(_req: Request, res: Response, next: NextFunction) {
    const context = _req.appContext;
    this.logger.info(`Request received to retrieve all examples`, context);
    try {
      const examples = await this.exService.getExamples(context);
      res.status(200).json(examples);
    } catch (err) {
      this.logger.error(`Error retrieving examples`, context);
      this.logger.debug(err, context);
      next(err);
    }
  }

  /**
   * Handles the HTTP PATCH request for updating an existing example.
   * @async
   * @param {Request} req - The Express request object.
   * @param {Response} res - The Express response object.
   * @param {NextFunction} next - The Express next middleware function.
   */
  async getExample(req: Request, res: Response, next: NextFunction) {
    const context = req.appContext;
    this.logger.info(
      `Request received to retrieve example ${req.params.id}`,
      context
    );
    try {
      const example = await this.exService.getExample(req.params.id);
      res.status(200).json(example);
    } catch (err) {
      this.logger.error(`Error retrieving example ${req.params.id}`, context);
      this.logger.debug(err, context);
      next(err);
    }
  }

  /**
   * Handles the HTTP PATCH request for updating an existing example.
   * @async
   * @param {Request} req - The Express request object.
   * @param {Response} res - The Express response object.
   * @param {NextFunction} next - The Express next middleware function.
   */
  async patchUpdateExample(req: Request, res: Response, next: NextFunction) {
    const context = req.appContext;
    this.logger.info(`Request received to update example`, context);
    try {
      const id = req.params.id;
      const example = await this.exService.updateExample({ id, ...req.body });
      res.status(200).json(example);
    } catch (err) {
      this.logger.error(`Error updating example`, context);
      this.logger.debug(err, context);
      next(err);
    }
  }

  /**
   * Handles the HTTP DELETE request for deleting an example by ID.
   * @async
   * @param {Request} req - The Express request object.
   * @param {Response} res - The Express response object.
   * @param {NextFunction} next - The Express next middleware function.
   */
  async deleteExample(req: Request, res: Response, next: NextFunction) {
    const context = req.appContext;
    this.logger.info(`Request received to delete example`, context);
    try {
      await this.exService.deleteExample(req.params.id);
      res.status(204).send();
    } catch (err) {
      this.logger.error(`Error deleting example`, context);
      this.logger.debug(err, context);
      next(err);
    }
  }
}
