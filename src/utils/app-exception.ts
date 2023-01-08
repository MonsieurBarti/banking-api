export class AppException extends Error {
  readonly message: string;
  readonly details: Record<string, any>;
  constructor(message: string, details?: Record<string, any>) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    this.message = message;
    this.details = details;
    Error.captureStackTrace(this);
  }
}
