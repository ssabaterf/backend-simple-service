import { PlatformError } from "./Errors";

export function parseError(err: unknown): {
  code: number;
  message: string;
  name: string;
} {
  let errMessage: string;
  let code: number = 500;
  let errorName = "Unknown Error";
  switch (typeof err) {
    case "string":
      errMessage = err as string;
      break;
    case "object":
      {
        if (err instanceof Error) {
          const platformError = err as PlatformError;
          errMessage = err.message;
          code = platformError.code ? platformError.code : 500;
          errorName = err.name;
        } else {
          errMessage = JSON.stringify(err);
        }
      }
      break;
    default:
      errMessage = "Unknown Error";
  }
  return { code, message: errMessage, name: errorName };
}
