import { Hono } from 'hono';

const indexRouter = new Hono();

indexRouter.get('/health', (c) => {
	return c.json({ ok: true });
});

export default indexRouter;
