import Router from 'koa-router';
import { createToken } from './controller';

const router = new Router();

// heartbeat api
router.get('/health', (ctx: any, next: Function) => {
    ctx.body = { health: 'ok' };
});

router.get('/createToken', createToken);

export { router };
