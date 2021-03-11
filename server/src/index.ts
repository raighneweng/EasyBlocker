import 'dotenv/config';
import path from 'path';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import koaStatic from 'koa-static';
import { router } from './routes';
import logger from './logger';
import mongo from './mongo';
import passport from 'koa-passport';
import session from 'koa-session';
import { Strategy } from 'passport-twitter';

const app = new Koa();

try {
    // mongodb start
    const dbUrl = process.env.MONGODB_URL;
    const dbSsl = process.env.MONGODB_USE_SSL === 'true';
    mongo.connect(dbUrl, dbSsl, true);
    // mongodb end

    app.keys = ['EasyBlocker'];

    passport.use(
        new Strategy(
            {
                consumerKey: process.env.TWITTER_CONSUMER_KEY,
                consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
                callbackURL: `${process.env.BASE_URL}/auth/twitter/callback`,
            },
            function (token, tokenSecret, profile, cb) {
                // start clear followers
                console.log(token, tokenSecret);
            },
        ),
    );

    app.use(session({}, app));
    app.use(koaStatic(path.join(__dirname, '../', 'public')));
    app.use(bodyParser());
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(router.routes()).use(router.allowedMethods());

    app.on('error', (err, ctx) => {
        logger.error(
            ctx.state.requestId,
            `[REQ]${ctx.request.method}:${ctx.request.url},[ERROR]:${err.msg}`,
        );
        console.dir(err);
    });

    app.listen(process.env.PORT, () => {
        console.log(`Server running on port ${process.env.PORT}`);
    });
} catch (error) {
    logger.error('(No Request ID, Out of Request)', error);
}
