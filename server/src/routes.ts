import Router from 'koa-router';

const router = new Router();

// heartbeat api
router.get('/health', (ctx: any, next: Function) => {
    ctx.body = { health: 'ok' };
});

export { router };
