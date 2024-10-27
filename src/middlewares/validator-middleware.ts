import { Request, Response, NextFunction } from 'express';
import { Schema, ValidationError } from 'joi';

type ValidSource = 'body' | 'params' | 'query';

const validate = (schema: Schema, source: ValidSource) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      let value: any;
      switch (source) {
        case 'body':
          value = req.body;
          break;
        case 'params':
          value = req.params;
          break;
        case 'query':
          value = req.query;
          break;
        default:
          return next(new Error('Invalid source specified for validation'));
      }

      const { error } = schema.validate(value);
      if (error) {
        return next(error);
      }
      next();
    } catch (error) {
      console.log(error);
      return next(error instanceof Error ? error : new Error('Unknown error occurred'));
    }
  };
};

export default validate;