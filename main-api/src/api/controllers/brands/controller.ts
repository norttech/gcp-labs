import BrandsService from '../../services/brands.service';
import { NextFunction, Request, Response } from 'express';

export class Controller {
    findAll(_: Request, res: Response) {
        BrandsService.findAll().then((r) => res.json(r));
    }

    async findById(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const branch = await BrandsService.findById(Number(id));
            res.json(branch);
            return;
        } catch (error) {
            next(error);
        }
    }

    create(req: Request, res: Response) {
        BrandsService.create(req.body.name).then((x) => res.json(x));
    }

    update(req: Request, res: Response) {
        const { id } = req.params;
        BrandsService.update(Number(id), req.body).then((x) => res.json(x));
    }

    delete(req: Request, res: Response) {
        const { id } = req.params;
        BrandsService.delete(Number(id)).then((x) => res.json(x));
    }
}
export default new Controller();
