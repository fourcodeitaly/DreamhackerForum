export class BaseError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
  }
}

export class NotFoundError extends BaseError {
  constructor(message: string = "Not Found") {
    super(message, 404);
  }
}

export class BadRequestError extends BaseError {
  constructor(message: string = "Bad Request") {
    super(message, 400);
  }
}

export class UnauthorizedError extends BaseError {
  constructor(message: string = "Unauthorized") {
    super(message, 401);
  }
}

export class ForbiddenError extends BaseError {
  constructor(message: string = "Forbidden") {
    super(message, 403);
  }
}

export class InternalServerError extends BaseError {
  constructor(message: string = "Internal Server Error") {
    super(message, 500);
  }
}
