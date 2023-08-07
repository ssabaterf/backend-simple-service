export class PlatformError extends Error {
  private constructor(
    readonly code: number,
    name: string,
    message: string
  ) {
    super(message);
    this.name = name;
  }

  static NotFound(message: string): PlatformError {
    return new PlatformError(404, "NotFound", message);
  }

  static BadRequest(message: string): PlatformError {
    return new PlatformError(400, "BadRequest", message);
  }

  static Internal(message: string): PlatformError {
    return new PlatformError(500, "Internal", message);
  }

  static Unauthorized(message: string): PlatformError {
    return new PlatformError(401, "Unauthorized", message);
  }

  static Forbidden(message: string): PlatformError {
    return new PlatformError(403, "Forbidden", message);
  }

  static Conflict(message: string): PlatformError {
    return new PlatformError(409, "Conflict", message);
  }

  static UnprocessableEntity(message: string): PlatformError {
    return new PlatformError(422, "UnprocessableEntity", message);
  }

  static NotImplemented(message: string): PlatformError {
    return new PlatformError(501, "NotImplemented", message);
  }

  static BadGateway(message: string): PlatformError {
    return new PlatformError(502, "BadGateway", message);
  }

  static ServiceUnavailable(message: string): PlatformError {
    return new PlatformError(503, "ServiceUnavailable", message);
  }

  static GatewayTimeout(message: string): PlatformError {
    return new PlatformError(504, "GatewayTimeout", message);
  }
}
