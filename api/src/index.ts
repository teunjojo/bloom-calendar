import { Hono } from 'hono';
import { cors } from 'hono/cors';

import indexRouter from '@/routes';
import eventRouter from '@/routes/event';
import forecastRouter from './routes/forecast';
import authRouter from './routes/auth';
import decorRouter from './routes/decor';
import flowerRouter from './routes/flower';

type Bindings = {
	bloom_calendar_database: D1Database;
	CORS_ORIGINS: string;
};

const app = new Hono<{ Bindings: Bindings }>();

app.use('*', async (c, next) => {
	const origins = c.env.CORS_ORIGINS
		.split(',')
		.map(o => o.trim())
		.filter(Boolean);

	return cors({
		credentials: true,
		origin: origins,
	})(c, next);
});

app.route('/', indexRouter);
app.route('/events', eventRouter);
app.route('/forecasts', forecastRouter);
app.route('/auth', authRouter);
app.route('/decors', decorRouter)
app.route('/flowers', flowerRouter)

export default app;
