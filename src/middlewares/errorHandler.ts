import { NextFunction, Request, Response } from "express";

interface CustomError extends Error {
  statusCode?: number;
  details?: any;
  errors?: any;
}

const errorHandler = (
  error: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(error);

  let statusCode = error.statusCode || 500;
  let message = error.message || 'Something went wrong!';
  let details = null;

  switch (error.name) {
    case 'ValidationError':
      statusCode = 400;
      details = error.details;
      break;
    case 'SequelizeUniqueConstraintError':
      statusCode = 400;
      message = 'Unique constraint violation';
      details = error.errors;
      break;
    case 'jwtError':
      statusCode = 401;
      message = 'Invalid token';
      details = error
      break;
  }

  res.status(statusCode).json({
    status: 'error',
    message,
    details,
    error: error.name
  });
};

export default errorHandler;