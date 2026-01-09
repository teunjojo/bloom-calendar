import { Hono } from 'hono';
import { cors } from 'hono/cors';

import indexRouter from '@/routes';
import eventRouter from '@/routes/event';
import forecastRouter from './routes/forecast';
import authRouter from './routes/auth';

type Bindings = {
	bloom_calendar_database: D1Database;
};

const app = new Hono<{ Bindings: Bindings }>();

app.use(
	cors({
		credentials: true,
		origin: [
			'https://bloom-calendar.teunjojo.com',
			'https://dev-bloom-calendar-frontend.teunjojo.workers.dev',
			'https://api.bloom-calendar.teunjojo.com/',
			'http://localhost:8787',
			'http://localhost:5173',
		],
	}),
);

app.route('/', indexRouter);
app.route('/events', eventRouter);
app.route('/forecasts', forecastRouter);
app.route('/auth', authRouter);

export default app;
