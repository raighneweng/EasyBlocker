import Router from 'koa-router';
import passport from 'koa-passport';

const router = new Router();

// heartbeat api
router.get('/health', (ctx: any, next: Function) => {
    ctx.body = { health: 'ok' };
});

router.get('/auth/twitter', passport.authenticate('twitter'));

router.get(
    '/auth/twitter/callback',
    passport.authenticate('twitter', { failureRedirect: '/' }),
    (ctx: any, next: Function) => {
        console.log('start....');
        ctx.redirect('/');
    },
);

export { router };
