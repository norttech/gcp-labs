import { Request, Response, NextFunction } from 'express';
import CustomError from '../../common/utils/customError';

export default function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction): void {
    if (err instanceof CustomError) res.status(err.getStatusCode()).json(err.getError());
    else res.status(500).json({ message: err.message });
}
