import path = require('path');
import l from './logger';
import errorHandler from '../api/middlewares/error.handler';
import * as express from 'express';
import * as cors from 'cors';

const app = express();

export default class ExpressServer {
    constructor() {
        const root = path.normalize(__dirname + '/../..');
        app.use(express.json({ limit: process.env.REQUEST_LIMIT || '100kb' }));
        app.use(cors({ methods: 'GET,PUT,POST,DELETE' }))
        app.use(express.static(`${root}/public`));
    }

    router(routes: (app: express.Application) => void): ExpressServer {
        routes(app);
        app.use(errorHandler);
        return this;
    }

    listen(port: number): express.Application {
        const welcome = () => l.info(`up and running in ${process.env.NODE_ENV || 'development'} @: on port: ${port}}`);

        app.listen(port, welcome);
        return app;
    }
}
