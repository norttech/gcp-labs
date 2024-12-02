import { Application, Router } from 'express';
import brandsRouter from './api/controllers/brands/router';
import productsRouter from './api/controllers/products/router';

export default function routes(app: Application): void {
    const router = Router();

    router.use('/brands', brandsRouter);
    router.use('/products', productsRouter);

    app.use('/api/v1', router);
}
