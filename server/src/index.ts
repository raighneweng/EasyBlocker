import 'dotenv/config';
import path from 'path';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import koaStatic from 'koa-static';
import { router } from './routes';
import logger from './logger';
import mongo from './mongo';

const app = new Koa();

try {
    // mongodb start
    const dbUrl = process.env.MONGODB_URL;
    const dbSsl = process.env.MONGODB_USE_SSL === 'true';
    mongo.connect(dbUrl, dbSsl, true);
    // mongodb end

    app.keys = ['EasyBlocker'];

    app.use(koaStatic(path.join(__dirname, '../', 'public')));
    app.use(bodyParser());
    app.use(router.routes()).use(router.allowedMethods());

    app.on('error', (err, ctx) => {
        logger.error(
            ctx.state.requestId,
            `[REQ]${ctx.request.method}:${ctx.request.url},[ERROR]:${err.msg}`,
        );
    });

    app.listen(process.env.PORT, () => {
        console.log(`Server running on port ${process.env.PORT}`);
    });
} catch (error) {
    logger.error('(No Request ID, Out of Request)', error);
}
