import { Hono } from 'hono';
import { cors } from 'hono/cors';

import indexRouter from '@/routes';
import eventRouter from '@/routes/event';
import forecastRouter from './routes/forecast';

type Bindings = {
	MY_KV: KVNamespace;
	DB: D1Database;
};

const app = new Hono<{ Bindings: Bindings }>(); // binding env value

app.use(
	cors({
		credentials: true,
		origin: [
			'https://bloom-calendar.teunjojo.com',
			'https://dev-bloom-calendar-frontend.teunjojo.workers.dev',
		],
	})
);

app.route('/', indexRouter);
app.route('/events', eventRouter);
app.route('/forecasts', forecastRouter);

export default app;
