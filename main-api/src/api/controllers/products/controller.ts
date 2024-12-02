import { NextFunction, Request, Response } from 'express';
import ProductsService from '../../services/products.service';

export class Controller {
    findAll(_: Request, res: Response) {
        ProductsService.findAll().then((r) => res.json(r));
    }

    async findById(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const branch = await ProductsService.findById(Number(id));
            res.json(branch);
            return;
        } catch (error) {
            next(error);
        }
    }

    create(req: Request, res: Response) {
        ProductsService.create(req.body.name).then((x) => res.json(x));
    }

    update(req: Request, res: Response) {
        const { id } = req.params;
        ProductsService.update(Number(id), req.body).then((x) => res.json(x));
    }

    delete(req: Request, res: Response) {
        const { id } = req.params;
        ProductsService.delete(Number(id)).then((x) => res.json(x));
    }
}
export default new Controller();
